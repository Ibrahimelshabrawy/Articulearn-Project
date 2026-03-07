import {TypeEnum} from "../../common/enum/exercise.enum.js";
import {DifficultyLevelEnum, RoleEnum} from "../../common/enum/user.enum.js";
import {successResponse} from "../../common/utils/response/success.response.js";
import * as db_services from "../../DB/db.services.js";
import exerciseModel from "../../DB/models/exercise.model.js";

export const createExercise = async (req, res, next) => {
  const {
    type,
    level,
    language,
    title,

    // pronunciation
    promptText,
    referenceAudioUrl,

    // sentence_builder
    gameAudioUrl,
    sentenceTemplate,
    options,
    correctAnswer,

    isActive,
  } = req.body;

  const exercise = await db_services.create({
    model: exerciseModel,
    data: {
      type,
      level,
      language,
      title,

      // pronunciation
      promptText: promptText ?? null,
      referenceAudioUrl: referenceAudioUrl ?? null,

      // sentence_builder
      gameAudioUrl: gameAudioUrl ?? null,
      sentenceTemplate: sentenceTemplate ?? null,
      options: options ?? [],
      correctAnswer: correctAnswer ?? null,

      isActive: isActive ?? true,
    },
  });
  successResponse({
    res,
    status: 201,
    message: "Created Exercise Successfully 🥳🥳",
    data: exercise,
  });
};

export const updateExercise = async (req, res, next) => {
  const {id} = req.params;

  const {
    type,
    level,
    language,
    title,
    promptText,
    referenceAudioUrl,
    gameAudioUrl,
    sentenceTemplate,
    options,
    correctAnswer,
    isActive,
  } = req.body;

  const exercise = await db_services.findOneAndUpdate({
    model: exerciseModel,
    filter: {_id: id},
    update: {
      type,
      level,
      language,
      title,
      promptText,
      referenceAudioUrl,
      gameAudioUrl,
      sentenceTemplate,
      options,
      correctAnswer,
      isActive,
    },
  });

  if (!exercise) {
    throw new Error("Exercise Not Found😥❗", {cause: 404});
  }

  successResponse({
    res,
    status: 200,
    message: "Exercise Updated Successfully 🥳🥳",
    data: exercise,
  });
};

export const deactivateExcercise = async (req, res, next) => {
  const {id} = req.params;
  const exercise = await db_services.findOneAndUpdate({
    model: exerciseModel,
    filter: {_id: id},
    update: {isActive: false},
    select: "isActive",
  });

  if (!exercise) {
    throw new Error("Exercise Not Found 😥", {cause: 404});
  }

  successResponse({
    res,
    status: 200,
    message: "Exercise Deactivated Successfully 🥳",
  });
};

export const activateExcercise = async (req, res, next) => {
  const {id} = req.params;
  const exercise = await db_services.findOneAndUpdate({
    model: exerciseModel,
    filter: {_id: id},
    update: {isActive: true},
    select: "isActive",
  });

  if (!exercise) {
    throw new Error("Exercise Not Found 😥", {cause: 404});
  }

  successResponse({
    res,
    status: 200,
    message: "Exercise Activated Successfully 🥳",
    data: exercise,
  });
};

export const listExercises = async (req, res, next) => {
  const {type, language, isActive, page = 1, size = 10} = req.query;
  const filter = {};

  if (type) filter.type = type;
  if (language) filter.language = language;

  // الطالب يشوف active بس
  if (req.user.role !== "admin") {
    filter.isActive = true;
  } else if (isActive !== undefined) {
    filter.isActive = isActive === "true";
  }

  // level filtering based on user's difficulty level
  if (req.user.role !== "admin") {
    const userLevel = req.user?.level;

    if (userLevel === DifficultyLevelEnum.beginner) {
      filter.level = DifficultyLevelEnum.beginner;
    } else if (userLevel === DifficultyLevelEnum.intermediate) {
      filter.level = {
        $in: [DifficultyLevelEnum.beginner, DifficultyLevelEnum.intermediate],
      };
    } else if (userLevel === DifficultyLevelEnum.advanced) {
      filter.level = {$in: Object.values(DifficultyLevelEnum)};
    }
  }

  const data = await db_services.paginate({
    model: exerciseModel,
    filter,
    page,
    size,
    options: {
      sort: {createdAt: -1},
      lean: true,
    },
  });

  successResponse({
    res,
    status: 200,
    message: "Exercises Fetched Successfully 🥳🥳",
    data,
  });
};

export const getExerciseByID = async (req, res, next) => {
  const {id} = req.params;
  const exercise = await db_services.findOne({
    model: exerciseModel,
    filter: {_id: id, isActive: true},
    select: req.user.role === RoleEnum.admin ? "" : "-correctAnswer",
    options: {
      lean: true,
    },
  });
  if (!exercise) {
    throw new Error("Exercise Not Found 😥", {cause: 404});
  }

  successResponse({
    res,
    status: 200,
    message: "Exercise Fetched Successfully 🥳🥳",
    data: exercise,
  });
};
