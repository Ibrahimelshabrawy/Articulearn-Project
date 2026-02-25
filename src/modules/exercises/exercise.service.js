import {successResponse} from "../../common/utils/response/success.response.js";
import * as db_services from "../../DB/db.services.js";
import exerciseModel from "../../DB/models/exercise.model.js";

export const createExercise = async (req, res, next) => {
  const {
    type,
    level,
    language,
    title,
    promptText,
    audioReferenceUrl,
    tips,
    tags,
    isActiveExercise,
  } = req.body;
  const exercise = await db_services.create({
    model: exerciseModel,
    data: {
      type,
      level,
      language,
      title,
      promptText,
      audioReferenceUrl,
      tips,
      tags,
      isActiveExercise,
    },
  });
  successResponse({
    res,
    status: 201,
    message: "Created Exercise Successfully 🥳🥳",
    data: exercise,
  });
};

export const listExercises = async (req, res, next) => {
  const {
    type,
    level,
    language,
    search,
    isActiveExercise,
    page = 1,
    size = 10,
  } = req.query;

  const filter = {};
  const active =
    isActiveExercise === undefined ? true : isActiveExercise === "true";
  filter.isActiveExercise = active;

  if (type) filter.type = type;
  if (level) filter.level = level;
  if (language) filter.language = language;

  if (typeof search === "string" && search.trim()) {
    const s = search.trim();
    filter.$or = [
      {promptText: {$regex: s, $options: "i"}},
      {title: {$regex: s, $options: "i"}},
    ];
  }

  const options = {
    lean: true,
    sort: {createdAt: -1},
  };

  const select = {
    title: 1,
    promptText: 1,
    type: 1,
    level: 1,
    language: 1,
    tags: 1,
    tips: 1,
    audioReferenceUrl: 1,
    isActiveExercise: 1,
    createdAt: 1,
  };

  const exercise = await db_services.paginate({
    model: exerciseModel,
    filter,
    options,
    select,
    page,
    size,
  });

  successResponse({
    res,
    status: 200,
    message: "Our Avaliable Exercises Is Here 🙂‍↔️✅",
    data: exercise,
  });
};

export const getExerciseById = async (req, res, next) => {
  const {id} = req.params;
  const exercise = await db_services.findById({
    model: exerciseModel,
    id,
    options: {
      lean: true,
    },
  });

  if (!exercise) {
    throw new Error("Exercise Not Found 😔❗", {cause: 404});
  }
  successResponse({
    res,
    status: 200,
    message: "Successfully Returned Exercise 🥳🥳",
    data: exercise,
  });
};

export const updateExercise = async (req, res, next) => {
  const update = req.body;
  const {id} = req.params;
  const exercise = await db_services.findOneAndUpdate({
    model: exerciseModel,
    filter: {_id: id},
    update: {$set: update},
    options: {
      lean: true,
    },
  });

  if (!exercise) {
    throw new Error("Exercise Not Found 😔❗", {cause: 404});
  }
  successResponse({
    res,
    status: 200,
    message: "Exercise updated successfully",
    data: exercise,
  });
};

export const deactivateExcercise = async (req, res, next) => {
  const {id} = req.params;
  const exerciseDeactivate = await db_services.findOneAndUpdate({
    model: exerciseModel,
    filter: {_id: id, isActiveExercise: true},
    update: {$set: {isActiveExercise: false}},
    options: {
      lean: true,
    },
    select: "isActiveExercise",
  });
  if (!exerciseDeactivate) {
    throw new Error("Exercise Not Found or deactivated 😔❗", {cause: 404});
  }
  successResponse({
    res,
    status: 200,
    message: "Exercise Deactivted Successfully 🥳🥳",
    data: exerciseDeactivate,
  });
};

export const activateExcercise = async (req, res, next) => {
  const {id} = req.params;
  const exerciseActivate = await db_services.findOneAndUpdate({
    model: exerciseModel,
    filter: {_id: id},
    update: {$set: {isActiveExercise: true}},
    options: {
      lean: true,
    },
  });
  if (!exerciseActivate) {
    throw new Error("Exercise Not Found 😔❗", {cause: 404});
  }
  successResponse({
    res,
    status: 200,
    message: "Exercise Activted Successfully 🥳🥳",
    data: exerciseActivate,
  });
};
