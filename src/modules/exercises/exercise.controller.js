import {Router} from "express";
import * as ES from "./exercise.service.js";
import * as EV from "./exercise.validation.js";
import * as AV from "../attempts/attempt.validation.js";
import * as AS from "../attempts/attempt.service.js";
import {authentication} from "../../common/middleware/Auth/authentication.middleware.js";
import {authorization} from "../../common/middleware/Auth/authorization.middleware.js";
import {RoleEnum} from "../../common/enum/user.enum.js";
import validation from "../../common/middleware/Validation/validation.middleware.js";
import attemptRoute from "../attempts/attempt.controller.js";
import multer_host from "../../common/middleware/multer/multer.js";
import {MulterEnum} from "../../common/enum/multer.enum.js";
const exerciseRoutes = Router();

// Create Exercise Pronunciation
exerciseRoutes.post(
  "/create-pronunciation",
  authentication,
  authorization([RoleEnum.admin]),
  multer_host([...MulterEnum.audio]).single("referenceAudioUrl"),
  validation(EV.createPronunciationExerciseSchema),
  ES.createPronunciationExercise,
);

// Create Exercise Sentence
exerciseRoutes.post(
  "/create-sentence",
  authentication,
  authorization([RoleEnum.admin]),
  multer_host([...MulterEnum.audio]).single("gameAudioUrl"),
  validation(EV.createSentenceBuilderExerciseSchema),
  ES.createSentenceBuilderExercise,
);

// Count Exercises
exerciseRoutes.get(
  "/count-exercises",
  authentication,
  authorization([RoleEnum.admin]),
  ES.countExercises,
);

// Fetch All Exercises Based On Level And Type
exerciseRoutes.get(
  "/:type/:level",
  authentication,
  authorization([RoleEnum.admin, RoleEnum.user]),
  validation(EV.getExercisesByTypeAndLevelSchema),
  ES.getExercisesByTypeAndLevel,
);

// Fetch Exercise By ID
exerciseRoutes.get(
  "/:id",
  authentication,
  authorization([RoleEnum.admin, RoleEnum.user]),
  validation(EV.getExerciseByIDSchema),
  ES.getExerciseByID,
);

// Update Exercise pronunciation
exerciseRoutes.patch(
  "/update-pronunciation/:id",
  authentication,
  authorization([RoleEnum.admin]),
  multer_host([...MulterEnum.audio]).single("referenceAudioUrl"),
  validation(EV.updatePronunciationExerciseSchema),
  ES.updateExerciseForPronunciation,
);

// Update Exercise Sentence
exerciseRoutes.patch(
  "/update-sentence/:id",
  authentication,
  authorization([RoleEnum.admin]),
  multer_host([...MulterEnum.audio]).single("gameAudioUrl"),
  validation(EV.updateSentenceBuilderExerciseSchema),
  ES.updateExerciseForSentence,
);

// Deactivate Exercise
exerciseRoutes.patch(
  "/deactivate/:id",
  authentication,
  authorization([RoleEnum.admin]),
  validation(EV.deactivateOrActivateExcerciseSchema),
  ES.deactivateExcercise,
);

// Activate Exercise
exerciseRoutes.patch(
  "/activate/:id",
  authentication,
  authorization([RoleEnum.admin]),
  validation(EV.deactivateOrActivateExcerciseSchema),
  ES.activateExcercise,
);

// Attempt Sentence Builder Exercise
exerciseRoutes.use("/:exerciseId/attempt", attemptRoute);

export default exerciseRoutes;
