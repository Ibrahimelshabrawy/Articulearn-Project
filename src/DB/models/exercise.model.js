import mongoose from "mongoose";
import {
  DifficultyLevelEnum,
  LearningLanguageEnum,
} from "../../common/enum/user.enum.js";
const exerciseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [TypeEnum.game, TypeEnum.sentence, TypeEnum.word],
      required: true,
      index: true,
    },
    level: {
      type: String,
      enum: [
        DifficultyLevelEnum.beginner,
        DifficultyLevelEnum.intermediate,
        DifficultyLevelEnum.advanced,
      ],
      required: true,
      index: true,
    },
    language: {
      type: String,
      enum: [LearningLanguageEnum.english, LearningLanguageEnum.arabic],
      default: LearningLanguageEnum.english,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    promptText: {
      // the (word-sentence) that user will pronounce it
      type: String,
      trim: true,
      required: true,
    },
    audioReferenceUrl: {
      type: String,
      default: null,
    },
    tips: {
      // شوية نصايح يعني
      type: [String],
      default: [],
      /* Example
      //       "tips": [
      //   "Focus on the 'sh' sound.",
      //   "Don't say 'sip'."
       ]
      */
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    stopExercise: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

exerciseSchema.index({title: "text", promptText: "text", tags: "text"});

const exerciseModel =
  mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema);

export default exerciseModel;
