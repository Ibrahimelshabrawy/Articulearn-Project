import mongoose, {Schema} from "mongoose";
import {LearningLanguageEnum} from "../../common/enum/user.enum.js";
const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    points: {
      type: Number,
      default: 0,
      min: 0,
    },
    overall: {
      avgScore: {type: Number, min: 0, max: 100, default: null},
      bestScore: {type: Number, min: 0, max: 100, default: null},
      totalAttempts: {type: Number, default: 0, min: 0},
      correctCount: {type: Number, default: 0, min: 0},
    },

    lastAttemptAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    strict: true,
    optimisticConcurrency: true,
  },
);

progressSchema.index({userId: 1, points: 1, lastAttemptAt: 1});

const progressModel =
  mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default progressModel;
