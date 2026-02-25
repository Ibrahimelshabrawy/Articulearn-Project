import mongoose, {Schema} from "mongoose";
import {ResultStatsEnum} from "../../common/enum/attempt.enum.js";

const phonemeErrorSchema = new mongoose.Schema(
  {
    phoneme: {
      type: String,
      required: true,
    },
    expected: {
      type: String,
      default: null,
    },
    actual: {
      type: String,
      default: null,
    },
  },
  {
    _id: false,
    timestamps: true,
  },
);

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
    audioUrl: {
      type: String,
      required: true,
    },
    durationMs: {
      type: Number,
      default: null,
    },
    status: {
      type: String,
      enum: [
        ResultStatsEnum.pending,
        ResultStatsEnum.success,
        ResultStatsEnum.failed,
      ],
      default: ResultStatsEnum.pending,
    },
    analysis: {
      transcript: {
        // النص اللي السيستم فهمه من كلام اليوزر
        type: String,
        default: "",
      },
      score: {
        // الاسكور ده هو نتيجة تحليله للصوت كان دقيق قد ايه
        type: Number,
        min: 0,
        max: 100,
        default: null,
        index: true,
      },
      phonemeErrors: {
        type: [phonemeErrorSchema],
        default: [],
      },
    },
    earnedPoints: {
      // لكن هنا انا بديله نقط بناء على الاسكور بتاعه كان كام يعني مثلا لو الاسكور اكبر من 80 هديله 6 ولو اقل من 50 هديله 3 وهكذا بقى ع حسب هتمشيها ازاي
      type: Number,
      default: 0,
      min: 0,
    },
    attemptRepeats: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
    strict: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},
  },
);

attemptSchema.index({userId: 1, createdAt: -1});
attemptSchema.index({userId: 1, exerciseId: 1, createdAt: -1});

const attempModel =
  mongoose.models.Attempt || mongoose.model("Attempt", exerciseSchema);

export default attempModel;
