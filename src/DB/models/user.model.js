import mongoose from "mongoose";
import {
  DifficultyLevelEnum,
  GenderEnum,
  LearningLanguageEnum,
  ProviderEnum,
  RoleEnum,
} from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 40,
    },

    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 40,
    },

    email: {
      type: String,
      required: function () {
        return this.provider === ProviderEnum.system ? true : false;
      },
      unique: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: false,
    },

    password: {
      type: String,
      required: function () {
        return this.provider == ProviderEnum.system ? true : false;
      },
    },

    // OAuth Providers (Google - Apple - etc)
    provider: {
      type: String,
      enum: [ProviderEnum.google, ProviderEnum.system],
      default: ProviderEnum.system,
    },
    oauthId: {
      type: String,
    },

    // Profile settings
    age: Number,

    learningLanguage: {
      type: String,
      enum: [LearningLanguageEnum.english, LearningLanguageEnum.arabic],
      default: LearningLanguageEnum.english,
    },

    difficultyLevel: {
      type: String,
      enum: [
        DifficultyLevelEnum.beginner,
        DifficultyLevelEnum.intermediate,
        DifficultyLevelEnum.advanced,
      ],
      default: DifficultyLevelEnum.beginner,
    },
    gender: {
      type: String,
      enum: [GenderEnum.male, GenderEnum.female],
      default: GenderEnum.male,
    },

    role: {
      type: String,
      enum: [RoleEnum.parent, RoleEnum.user, RoleEnum.admin],
      default: RoleEnum.user,
    },
    soundSettings: {
      microphoneSensitivity: {
        type: Number,
        default: 1,
      },
      speechSpeed: {
        type: Number,
        default: 1,
      },
    },

    // Progress System
    level: {
      type: Number,
      default: 1,
    },
    xp: {
      type: Number,
      default: 0,
    },

    badges: [
      {
        title: String,
        icon: String,
        date: Date,
      },
    ],

    // Parent Access
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    optimisticConcurrency: true,
    lean: true,
    strict: true,
    strictQuery: true,
  },
);

userSchema
  .virtual("userName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (value) {
    const [firstName, lastName] = value?.split(" ") || [];
    this.set({
      firstName,
      lastName,
    });
  });
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
