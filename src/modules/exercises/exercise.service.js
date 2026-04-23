import cloudinary from "../../common/utils/cloudinary/cloudinary.js";
import {TypeEnum} from "../../common/enum/exercise.enum.js";
import {DifficultyLevelEnum, RoleEnum} from "../../common/enum/user.enum.js";
import {successResponse} from "../../common/utils/response/success.response.js";
import * as db_services from "../../DB/db.services.js";
import exerciseModel from "../../DB/models/exercise.model.js";

export const createPronunciationExercise = async (req, res, next) => {
  let {level, language, title, promptText, referenceAudioUrl, isActive} =
    req.body;

  referenceAudioUrl = await cloudinary.uploader.upload(req.file.path, {
    folder: "Articulearn/Pronunciation/referenceAudioUrl",
    resource_type: "video",
  });

  referenceAudioUrl = {
    secure_url: referenceAudioUrl.secure_url,
    public_id: referenceAudioUrl.public_id,
  };

  const exercise = await db_services.create({
    model: exerciseModel,
    data: {
      type: TypeEnum.pronunciation,
      level,
      language,
      title,
      promptText,
      referenceAudioUrl,
      gameAudioUrl: null,
      sentenceTemplate: null,
      options: [],
      correctAnswer: null,
      isActive: isActive ?? true,
    },
  });

  successResponse({
    res,
    status: 201,
    message: "Pronunciation Exercise Created Successfully 🎤",
    data: exercise,
  });
};

export const createSentenceBuilderExercise = async (req, res, next) => {
  let {
    level,
    language,
    title,
    gameAudioUrl,
    sentenceTemplate,
    options,
    correctAnswer,
    isActive,
  } = req.body;

  options = options ? options.split(",").map((item) => item.trim()) : [];

  gameAudioUrl = await cloudinary.uploader.upload(req.file.path, {
    folder: "Articulearn/SentenceBuilder/GameAudioUrl",
    resource_type: "video",
  });

  gameAudioUrl = {
    secure_url: gameAudioUrl.secure_url,
    public_id: gameAudioUrl.public_id,
  };

  const exercise = await db_services.create({
    model: exerciseModel,
    data: {
      type: TypeEnum.sentence_builder,
      level,
      language,
      title,
      promptText: null,
      referenceAudioUrl: null,
      gameAudioUrl,
      sentenceTemplate,
      options,
      correctAnswer,
      isActive: isActive ?? true,
    },
  });

  successResponse({
    res,
    status: 201,
    message: "Sentence Builder Exercise Created Successfully 🧩",
    data: exercise,
  });
};

export const updateExerciseForPronunciation = async (req, res, next) => {
  const {id} = req.params;

  let {level, language, title, promptText, isActive} = req.body;

  const findExercise = await db_services.findById({
    model: exerciseModel,
    id,
  });

  if (!findExercise) {
    throw new Error("Exercise Not Found 😥❗", {cause: 404});
  }

  if (req.file) {
    if (findExercise.referenceAudioUrl?.public_id) {
      await cloudinary.uploader.destroy(
        findExercise.referenceAudioUrl.public_id,
        {resource_type: "video"},
      );
    }

    const refAudioUrl = await cloudinary.uploader.upload(req.file.path, {
      folder: "Articulearn/Pronunciation/referenceAudioUrl",
      resource_type: "video",
    });

    findExercise.referenceAudioUrl = {
      secure_url: refAudioUrl.secure_url,
      public_id: refAudioUrl.public_id,
    };

    fs.unlinkSync(req.file.path);
  }

  const updateData = {};

  if (level !== undefined) updateData.level = level;
  if (language !== undefined) updateData.language = language;
  if (title !== undefined) updateData.title = title;
  if (promptText !== undefined) updateData.promptText = promptText;
  if (isActive !== undefined) updateData.isActive = isActive;

  if (req.file) {
    updateData.referenceAudioUrl = findExercise.referenceAudioUrl;
  }

  const exercise = await db_services.findOneAndUpdate({
    model: exerciseModel,
    filter: {_id: id},
    update: updateData,
  });

  successResponse({
    res,
    status: 200,
    message: "Exercise Updated Successfully 🥳🥳",
    data: exercise,
  });
};

export const updateExerciseForSentence = async (req, res, next) => {
  const {id} = req.params;

  let {
    level,
    language,
    title,
    gameAudioUrl,
    sentenceTemplate,
    options,
    correctAnswer,
    isActive,
  } = req.body;

  const findExercise = await db_services.findById({
    model: exerciseModel,
    id,
  });
  if (!findExercise) {
    throw new Error("Exercise Not Found😥❗", {cause: 404});
  }

  if (req.file) {
    if (findExercise.gameAudioUrl.public_id) {
      await cloudinary.uploader.destroy(findExercise.gameAudioUrl.public_id, {
        resource_type: "video",
      });
    }
  }

  let gameAudioUri = await cloudinary.uploader.upload(req.file.path, {
    folder: "Articulearn/SentenceBuilder/GameAudioUrl",
    resource_type: "video",
  });
  findExercise.gameAudioUrl = {
    secure_url: gameAudioUri.secure_url,
    public_id: gameAudioUri.public_id,
  };

  const exercise = await db_services.findOneAndUpdate({
    model: exerciseModel,
    filter: {_id: id},
    update: {
      level,
      language,
      title,
      gameAudioUrl: findExercise.gameAudioUrl,
      sentenceTemplate,
      options,
      correctAnswer,
      isActive,
    },
  });

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

export const getExercisesByTypeAndLevel = async (req, res, next) => {
  const {type, level} = req.params;
  const {page = 1, size = 10} = req.query;

  const filter = {type, level};

  if (req.user.role !== RoleEnum.admin) {
    filter.isActive = true;
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
    message: "Exercises fetched successfully 📚",
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

export const countExercises = async (req, res, next) => {
  const [total, active, inactive] = await Promise.all([
    db_services.countDocuments({
      model: exerciseModel,
    }),
    db_services.countDocuments({
      model: exerciseModel,
      filter: {isActive: true},
    }),
    db_services.countDocuments({
      model: exerciseModel,
      filter: {isActive: false},
    }),
  ]);

  successResponse({
    res,
    status: 200,
    data: {
      totalExercises: total,
      activeExercises: active,
      inactiveExercises: inactive,
    },
  });
};
