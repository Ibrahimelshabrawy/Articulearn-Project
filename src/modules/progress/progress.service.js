import * as db_services from "../../DB/db.services.js";
import progressModel from "../../DB/models/progress.model.js";
import userModel from "../../DB/models/user.model.js";
import {TypeEnum} from "../../common/enum/exercise.enum.js";
import {successResponse} from "../../common/utils/response/success.response.js";

export const updateProgressAfterAttempt = async ({
  userId,
  type,
  accuracy = null,
  isCorrect = null,
}) => {
  let progress = await db_services.findOne({
    model: progressModel,
    filter: {userId},
  });

  // create progress لو مش موجود
  if (!progress) {
    progress = await db_services.create({
      model: progressModel,
      data: {userId},
    });
  }

  // ======================
  // pronunciation progress
  // ======================
  if (type === TypeEnum.pronunciation) {
    const oldAttempts = progress.pronunciation.totalAttempts;
    const oldAvgAccuracy = progress.pronunciation.avgAccuracy;

    const newAttempts = oldAttempts + 1;

    // correctAttempts لو accuracy > 50
    if (accuracy > 50) {
      progress.pronunciation.correctAttempts += 1;
    }

    // update avgAccuracy
    const newAvgAccuracy =
      (oldAvgAccuracy * oldAttempts + accuracy) / newAttempts;

    progress.pronunciation.totalAttempts = newAttempts;

    progress.pronunciation.avgAccuracy = Number(newAvgAccuracy.toFixed(2));
  }

  // ======================
  // sentence builder progress
  // ======================
  if (type === TypeEnum.sentence_builder) {
    progress.sentenceBuilder.totalAttempts += 1;

    if (isCorrect) {
      progress.sentenceBuilder.correctAttempts += 1;
      progress.sentenceBuilder.totalScore += 100;
    }
  }

  progress.lastAttemptAt = new Date();

  await progress.save();

  return progress;
};

export const getChildProgress = async (req, res, next) => {
  const {childId} = req.params;

  const child = await db_services.findOne({
    model: userModel,
    filter: {_id: childId},
    select: "parentId",
  });

  if (!child) {
    throw new Error("Child not found", {cause: 404});
  }

  const isAdmin = req.user.role === RoleEnum.admin;
  const isParent = child.parentId?.toString() === req.user._id.toString();
  const isSelf = req.user._id.toString() === childId;

  if (!isAdmin && !isParent && !isSelf) {
    throw new Error("Not authorized to view this progress", {cause: 403});
  }

  const progress = await db_services.findOne({
    model: progressModel,
    filter: {userId: childId},
  });

  if (!progress) {
    return successResponse({
      res,
      message: "No progress yet",
      data: {
        pronunciation: {
          totalAttempts: 0,
          correctAttempts: 0,
          avgAccuracy: 0,
        },
        sentenceBuilder: {
          totalAttempts: 0,
          correctAttempts: 0,
          totalScore: 0,
        },
      },
    });
  }

  successResponse({
    res,
    message: "Child progress fetched successfully 📊",
    data: progress,
  });
};
