import mongoose from "mongoose";
import {TypeEnum} from "../../common/enum/exercise.enum.js";
import {
  DifficultyLevelEnum,
  LearningLanguageEnum,
} from "../../common/enum/user.enum.js";
const exerciseSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [TypeEnum.pronunciation, TypeEnum.sentence_builder],
      required: true,
    },

    level: {
      type: String,
      enum: [
        DifficultyLevelEnum.beginner,
        DifficultyLevelEnum.intermediate,
        DifficultyLevelEnum.advanced,
      ],
      required: true,
    },

    language: {
      type: String,
      enum: [LearningLanguageEnum.arabic, LearningLanguageEnum.english],
      default: LearningLanguageEnum.english,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    // ====== PRONUNCIATION ======
    // الجملة اللي هيقرأها و ينطقها
    promptText: {
      type: String,
      default: null,
    },

    // الريكورد اللي هيمسعه عشان ينطق شبهه ك وسيلة مساعده انه يسمع النطق الصح
    referenceAudioUrl: {
      type: String,
      default: null,
    },

    // ====== LISTENING GAME ======
    // الريكورد اللي هيسمعه عشان يكمل الجملة الناقصة
    gameAudioUrl: {
      type: String,
      default: null,
    },

    sentenceTemplate: {
      // Example: "I ___ to school yesterday."
      type: String,
      default: null,
    },

    // الاختيارات اللي هيختار منها الكلمة الناقصة
    choices: {
      type: [String],
      default: [],
    },

    correctAnswer: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {timestamps: true},
);
exerciseSchema.index({type: 1, level: 1, language: 1, isActive: 1});

const exerciseModel =
  mongoose.models.Exercise || mongoose.model("Exercise", exerciseSchema);

export default exerciseModel;
