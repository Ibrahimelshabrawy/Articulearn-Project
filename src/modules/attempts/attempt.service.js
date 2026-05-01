import {ResultStatsEnum} from "../../common/enum/attempt.enum.js";
import {TypeEnum} from "../../common/enum/exercise.enum.js";
import * as db_services from "../../DB/db.services.js";
import attemptModel from "../../DB/models/attempt.model.js";
import exerciseModel from "../../DB/models/exercise.model.js";
import {updateProgressAfterAttempt} from "../progress/progress.service.js";
import {successResponse} from "../../common/utils/response/success.response.js";
import cloudinary from "../../common/utils/cloudinary/cloudinary.js";
import FormData from "form-data";
import fs from "node:fs";
import axios from "axios";
import {AI_URL} from "../../../config/config.service.js";

export const createSentenceBuilderAttempt = async (req, res, next) => {
  const {exerciseId} = req.params;
  const {selectedAnswer} = req.body;

  const exercise = await db_services.findById({
    model: exerciseModel,
    id: exerciseId,
  });

  if (!exercise) throw new Error("Exercise Not Found 😥", {cause: 404});

  if (exercise.type !== TypeEnum.sentence_builder)
    throw new Error("Exercise Not Sentence Builder 😥", {
      cause: 400,
    });

  if (!exercise.isActive)
    throw new Error("Exercise Not Active 😥", {cause: 400});

  const isCorrect =
    selectedAnswer.trim().toLowerCase() ===
    exercise.correctAnswer.trim().toLowerCase();

  const score = isCorrect ? 100 : 0;

  const feedback = isCorrect
    ? "Correct Answer , Great Job🥳"
    : "Wrong Answer ,Try Again😥❌";

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

  // update progress
  await updateProgressAfterAttempt({
    userId: req.user._id,
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

export const createPronunciationAttempt = async (req, res, next) => {
  const {exerciseId} = req.params;

  const exercise = await db_services.findById({
    model: exerciseModel,
    id: exerciseId,
  });

  if (!exercise) throw new Error("Exercise Not Found ❗", {cause: 404});

  if (exercise.type !== TypeEnum.pronunciation)
    throw new Error("Invalid Exercise Type❗", {
      cause: 400,
    });

  // upload audio
  const audio = await cloudinary.uploader.upload(req.file.path, {
    resource_type: "video",
    folder: "Articulearn/Pronunciation/userAudio",
  });

  // send to AI
  const formData = new FormData();

  formData.append("target_word", exercise.promptText);
  formData.append("file", fs.createReadStream(req.file.path));

  const {data} = await axios.post(`${AI_URL}`, formData, {
    headers: formData.getHeaders(),
  });

  const targetWord = data.target;
  const recognizedText = data.predicted;
  const accuracy = data.scores.accuracy;
  const feedback = data.feedback;

  await db_services.create({
    model: attemptModel,
    data: {
      userId: req.user._id,
      exerciseId,
      type: TypeEnum.pronunciation,

      audioUrl: {
        secure_url: audio.secure_url,
        public_id: audio.public_id,
      },

      referenceText: exercise.promptText,
      targetWord,
      recognizedText,
      accuracy,
      feedback,

      status: ResultStatsEnum.success,
    },
  });

  // update progress
  await updateProgressAfterAttempt({
    userId: req.user._id,
    type: TypeEnum.pronunciation,
    accuracy,
  });

  fs.unlinkSync(req.file.path);

  successResponse({
    res,
    message: "Pronunciation evaluated successfully 🎤",
    data: {
      accuracy,
      feedback,
      targetWord,
    },
  });
};
