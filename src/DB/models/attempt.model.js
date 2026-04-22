import mongoose, {Schema} from "mongoose";
import {ResultStatsEnum} from "../../common/enum/attempt.enum.js";
import {TypeEnum} from "../../common/enum/exercise.enum.js";
const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    exerciseId: {
      type: Schema.Types.ObjectId,
      ref: "Exercise",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(TypeEnum),
      required: true,
      index: true,
    },

    // ====== Pronunciation submission ======
    audioUrl: {
      secure_url: {type: String, default: null},
      public_id: {type: String, default: null},
      _id: false,
    },
    durationMs: {type: Number, default: null},
    referenceText: {type: String, default: null}, // snapshot من Exercise.promptText
    targetWord: {
      type: String,
      default: null,
      trim: true,
    },
    // الكلمة اللي اليوزر نطقها فعليا
    recognizedText: {
      type: String,
      default: null,
      trim: true,
    },

    // ====== Game submission ======
    selectedAnswer: {type: String, default: null},

    // ====== Result ======
    status: {
      type: String,
      enum: Object.values(ResultStatsEnum),
      default: ResultStatsEnum.pending,
      index: true,
    },

    score: {type: Number, min: 0, max: 100, default: null},
    feedback: {type: String, default: null, trim: true},

    isCorrect: {type: Boolean, default: null}, // للعبة

    errorMessage: {type: String, default: null},
  },
  {
    timestamps: true,
    strict: true,
  },
);

// validation حسب النوع
attemptSchema.pre("validate", function () {
  if (this.type === TypeEnum.pronunciation) {
    if (!this.audioUrl) {
      throw new Error("audioUrl is required for pronunciation attempt.");
    }

    if (!this.referenceText) {
      throw new Error("referenceText is required for pronunciation attempt.");
    }
  }

  if (this.type === TypeEnum.sentence_builder) {
    if (!this.selectedAnswer) {
      throw new Error(
        "selectedAnswer is required for sentence builder attempt.",
      );
    }
  }
});
attemptSchema.index({userId: 1, createdAt: -1});
attemptSchema.index({userId: 1, exerciseId: 1, createdAt: -1});

const attemptModel =
  mongoose.models.Attempt || mongoose.model("Attempt", attemptSchema);

export default attemptModel;
