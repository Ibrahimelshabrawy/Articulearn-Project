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
    providerId: {type: String, default: null},
  },
  {_id: false},
);

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      minlength: 3,
      maxlength: 40,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      minlength: 3,
      maxlength: 40,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {type: String, default: null, trim: true, index: true},

    password: {type: String, default: null},

    providers: {
      type: [providerSchema],
      default: [{provider: ProviderEnum.system}],
    },
    language: {
      type: String,
      enum: [LearningLanguageEnum.english, LearningLanguageEnum.arabic],
      default: LearningLanguageEnum.english,
    },
    level: {
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
    age: {
      type: Number,
    },

    role: {
      type: String,
      enum: [RoleEnum.parent, RoleEnum.user, RoleEnum.admin],
      default: RoleEnum.user,
      index: true,
    },

    parentLinkCode: {
      type: String,
      default: null,
      unique: true,
      index: true,
    },

    // ✅ Parent link (only for child accounts)
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: undefined,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: true,
    optimisticConcurrency: true,
  },
);
userSchema.index(
  {parentLinkCode: 1},
  {unique: true, partialFilterExpression: {parentLinkCode: {$type: "string"}}},
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
