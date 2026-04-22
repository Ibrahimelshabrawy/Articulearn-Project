import {ResultStatsEnum} from "../../common/enum/attempt.enum.js";
import {TypeEnum} from "../../common/enum/exercise.enum.js";
import * as db_services from "../../DB/db.services.js";
import attemptModel from "../../DB/models/attempt.model.js";
import exerciseModel from "../../DB/models/exercise.model.js";
import {updateProgressAfterAttempt} from "../progress/progress.service.js";
import {successResponse} from "../../common/utils/response/success.response.js";

export const createSentenceBuilderAttempt = async (req, res, next) => {
  const {exerciseId} = req.params;
  const {selectedAnswer} = req.body;

  const exercise = await db_services.findById({
    model: exerciseModel,
    id: exerciseId,
  });

  if (!exercise) {
    throw new Error("Exercise Not Found 😥", {cause: 404});
  }

  if (exercise.type !== TypeEnum.sentence_builder) {
    throw new Error("Exercise Not Sentence Builder 😥", {cause: 400});
  }

  if (!exercise.isActive) {
    throw new Error("Exercise Not Active 😥", {cause: 400});
  }

  const isCorrect =
    selectedAnswer.trim().toLowerCase() ===
    exercise.correctAnswer.trim().toLowerCase();
  const score = isCorrect ? 100 : 0;
  const feedback = isCorrect
    ? "Correct Answer , Great Job🥳"
    : "Wrong Answer ,Try Again😥❌";

  // Create Attempt
  const attempt = await db_services.create({
    model: attemptModel,
    data: {
      userId: req.user._id,
      exerciseId,
      type: exercise.type,
      selectedAnswer,
      isCorrect,
      feedback,
      score,
      status: ResultStatsEnum.success,
    },
  });

  // Update Progress
  await updateProgressAfterAttempt({
    userId: req.user._id,
    score,
    type: exercise.type,
    isCorrect,
  });
  successResponse({
    res,
    status: 201,
    message: "Attempt Created Successfully 🥳",
    data: attempt,
  });
};
