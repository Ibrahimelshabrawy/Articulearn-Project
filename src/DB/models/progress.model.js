import mongoose, {Schema} from "mongoose";
const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    pronunciation: {
      totalAttempts: {type: Number, default: 0},
      correctAttempts: {type: Number, default: 0},
      avgAccuracy: {type: Number, default: 0},
    },

    sentenceBuilder: {
      totalAttempts: {type: Number, default: 0},
      correctAttempts: {type: Number, default: 0},
      totalScore: {type: Number, default: 0},
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

const progressModel =
  mongoose.models.Progress || mongoose.model("Progress", progressSchema);

export default progressModel;
