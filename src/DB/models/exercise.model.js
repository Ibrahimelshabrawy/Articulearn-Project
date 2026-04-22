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
      enum: Object.values(TypeEnum),
      required: true,
    },

    level: {
      type: String,
      enum: Object.values(DifficultyLevelEnum),
      required: true,
    },

    language: {
      type: String,
      enum: Object.values(LearningLanguageEnum),
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
      secure_url: {type: String, default: null},
      public_id: {type: String, default: null},
      _id: false,
    },

    // ====== Sentence Builder GAME ======
    // الريكورد اللي هيسمعه عشان يكمل الجملة الناقصة
    gameAudioUrl: {
      secure_url: {type: String, default: null},
      public_id: {type: String, default: null},
      _id: false,
    },
    sentenceTemplate: {
      // Example: "I ___ to school yesterday."
      type: String,
      default: null,
    },

    // الاختيارات اللي هيختار منها الكلمة الناقصة
    options: {
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
