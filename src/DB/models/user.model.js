import mongoose from "mongoose";
import {
  DifficultyLevelEnum,
  GenderEnum,
  LearningLanguageEnum,
  ProviderEnum,
  RoleEnum,
} from "../../common/enum/user.enum.js";

const providerSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: [ProviderEnum.google, ProviderEnum.system],
      default: ProviderEnum.system,
      required: true,
    },
    providerId: {
      type: String,
    },
  },
  {
    _id: false,
  },
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 40,
      trim: true,
    },

    lastName: {
      type: String,
      minlength: 3,
      maxlength: 40,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      sparse: true,
    },

    phone: {
      type: String,
      required: false,
      trim: true,
      index: true,
    },

    password: {
      type: String,
    },

    // OAuth Providers (Google - System)

    providers: {
      type: [providerSchema],
      default: [{provider: ProviderEnum.system}],
    },

    // Profile settings
    age: Number,
    settings: {
      language: {
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
      index: true,
    },

    // Progress System
    stats: {
      level: {
        type: Number,
        default: 1,
        min: 1,
      },
      points: {
        type: Number,
        default: 0,
        min: 0,
        index: true,
      },

      badges: [
        {
          title: String,
          icon: String,
        },
      ],
    },

    // Parent Access
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: true,
    optimisticConcurrency: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
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
const userModel = mongoose.models.User || mongoose.model("User", userSchema);

export default userModel;
