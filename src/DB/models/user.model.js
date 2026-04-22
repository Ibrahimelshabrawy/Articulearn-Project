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
      required: function () {
        return this.provider == ProviderEnum.system ? true : false;
      },
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {type: String, default: null, trim: true, index: true},

    password: {
      type: String,
      default: null,
      required: function () {
        return this.provider == ProviderEnum.system ? true : false;
      },
    },

    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      default: ProviderEnum.system,
    },
    language: {
      type: String,
      enum: Object.values(LearningLanguageEnum),
      default: LearningLanguageEnum.english,
    },
    level: {
      type: String,
      enum: Object.values(DifficultyLevelEnum),
      default: DifficultyLevelEnum.beginner,
    },

    gender: {
      type: String,
      enum: Object.values(GenderEnum),
      default: GenderEnum.male,
    },
    age: {
      type: Number,
    },

    role: {
      type: String,
      enum: Object.values(RoleEnum),
      default: RoleEnum.user,
      index: true,
    },

    parentLinkCode: {
      type: String,
      default: undefined,
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
  {partialFilterExpression: {parentLinkCode: {$type: "string"}}},
);

const userModel = mongoose.models.User || mongoose.model("User", userSchema);
export default userModel;
