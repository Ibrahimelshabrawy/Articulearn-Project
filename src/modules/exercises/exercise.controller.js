import {Router} from "express";
import * as ES from "./exercise.service.js";
import {authentication} from "../../common/middleware/Auth/authentication.middleware.js";
import {authorization} from "../../common/middleware/Auth/authorization.middleware.js";
import {RoleEnum} from "../../common/enum/user.enum.js";
import validation from "../../common/middleware/Validation/validation.middleware.js";
import * as EV from "./exercise.validation.js";

const exerciseRoutes = Router();

// Create Exercise
exerciseRoutes.post(
  "/",
  authentication,
  authorization([RoleEnum.admin]),
  validation(EV.createExerciseSchema),
  ES.createExercise,
);

// Fetch All Exercises Based On Level
exerciseRoutes.get(
  "/",
  authentication,
  validation(EV.listExercisesSchema),
  ES.listExercises,
);

// Fetch Exercise By ID
exerciseRoutes.get(
  "/:id",
  authentication,
  validation(EV.getExerciseByIDSchema),
  ES.getExerciseByID,
);

// Update Exercise
exerciseRoutes.patch(
  "/:id",
  authentication,
  authorization([RoleEnum.admin]),
  validation(EV.updateExerciseSchema),
  ES.updateExercise,
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

export default exerciseRoutes;

// list
// GET http://localhost:3000/exercises?page=1&size=10
