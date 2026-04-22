import * as db_services from "../../DB/db.services.js";
import progressModel from "../../DB/models/progress.model.js";
import {TypeEnum} from "../../common/enum/exercise.enum.js";

export const updateProgressAfterAttempt = async ({
  userId,
  score,
  type,
  isCorrect = null,
}) => {
  let progress = await db_services.findOne({
    model: progressModel,
    filter: {userId},
  });

  if (!progress) {
    progress = await db_services.create({
      model: progressModel,
      data: {
        userId,
        points: 0,
        overall: {
          avgScore: null,
          bestScore: null,
          totalAttempts: 0,
          correctCount: 0,
        },
        lastAttemptAt: null,
      },
    });
  }

  const oldTotalAttempts = progress.overall.totalAttempts;
  const oldAvgScore = progress.overall.avgScore ?? 0;
  const oldBestScore = progress.overall.bestScore ?? 0;
  const oldCorrectCount = progress.overall.correctCount ?? 0;
  const oldPoints = progress.points ?? 0;

  // totalAttempts
  const newTotalAttempts = oldTotalAttempts + 1;

  // avgScore
  const newAvgScore =
    (oldAvgScore * oldTotalAttempts + score) / newTotalAttempts;

  // bestScore
  const newBestScore = Math.max(oldBestScore, score);

  // points
  const newPoints = oldPoints + score;

  // correctCount
  let newCorrectCount = oldCorrectCount;
  if (type === TypeEnum.sentence_builder && isCorrect === true) {
    newCorrectCount += 1;
  }

  progress.points = newPoints;
  progress.overall.avgScore = Number(newAvgScore.toFixed(2));
  progress.overall.bestScore = newBestScore;
  progress.overall.totalAttempts = newTotalAttempts;
  progress.overall.correctCount = newCorrectCount;
  progress.lastAttemptAt = new Date();

  await progress.save();

  return progress;
};
