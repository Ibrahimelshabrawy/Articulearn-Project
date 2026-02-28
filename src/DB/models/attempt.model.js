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

    // مهم عشان يخدم النوعين
    type: {
      type: String,
      enum: [TypeEnum.pronunciation, TypeEnum.sentence_builder],
      required: true,
      index: true,
    },

    // ====== Pronunciation submission ======
    audioUrl: {type: String, default: null},
    durationMs: {type: Number, default: null},
    referenceText: {type: String, default: null}, // snapshot من Exercise.promptText

    // ====== Game submission ======
    selectedAnswer: {type: String, default: null},

    // ====== Result ======
    status: {
      type: String,
      enum: [
        ResultStatsEnum.pending,
        ResultStatsEnum.success,
        ResultStatsEnum.failed,
      ],
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
attemptSchema.pre("validate", function (next) {
  if (this.type === TypeEnum.pronunciation) {
    if (!this.audioUrl)
      return next(new Error("audioUrl is required for pronunciation attempt."));
    if (!this.referenceText)
      return next(
        new Error("referenceText is required for pronunciation attempt."),
      );
  }

  if (this.type === TypeEnum.sentence_builder) {
    if (!this.selectedAnswer)
      return next(
        new Error("selectedAnswer is required for listening_game attempt."),
      );
  }

  next();
});

attemptSchema.index({userId: 1, createdAt: -1});
attemptSchema.index({userId: 1, exerciseId: 1, createdAt: -1});

const attemptModel =
  mongoose.models.Attempt || mongoose.model("Attempt", attemptSchema);

export default attemptModel;
