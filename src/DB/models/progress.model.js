import mongoose, {Schema} from "mongoose";
import {LearningLanguageEnum} from "../../common/enum/user.enum.js";

const weakPhonemeErrorsSchema = new mongoose.Schema(
  {
    phoneme: {
      type: String,
      required: true,
    },
    errorCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: 0,
  },
);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
      unique: true,
    },
    language: {
      type: String,
      enum: [LearningLanguageEnum.english, LearningLanguageEnum.arabic],
      default: LearningLanguageEnum.english,
    },
    overall: {
      avgScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      bestScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      totalAttempts: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    weakPhonemes: {
      type: [weakPhonemeErrorsSchema],
      default: [],
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

const progressModel =
  mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default progressModel;
