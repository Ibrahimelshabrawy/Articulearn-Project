import {Router} from "express";
import * as ES from "./exercise.service.js";
import {authentication} from "../../common/middleware/Auth/authentication.middleware.js";
import {authorization} from "../../common/middleware/Auth/authorization.middleware.js";
import {RoleEnum} from "../../common/enum/user.enum.js";
import validation from "../../common/middleware/Validation/validation.middleware.js";
import * as EV from "./exercise.validation.js";

const exerciseRoutes = Router();

exerciseRoutes.post(
  "/",
  authentication,
  authorization([RoleEnum.admin]),
  validation(EV.createExerciseSchema),
  ES.createExercise,
);
exerciseRoutes.get(
  "/",
  validation(EV.listExerciseQuerySchema),
  ES.listExercises,
);
exerciseRoutes.get("/:id", validation(EV.idParamSchema), ES.getExerciseById);
exerciseRoutes.patch(
  "/:id",
  authentication,
  authorization([RoleEnum.admin]),
  validation(EV.updateExerciseSchema),
  ES.updateExercise,
);

exerciseRoutes.patch(
  "/deactivate/:id",
  authentication,
  authorization([RoleEnum.admin]),
  validation(EV.idParamSchema, EV.updateExerciseSchema),
  ES.deactivateExcercise,
);

exerciseRoutes.patch(
  "/activate/:id",
  authentication,
  authorization([RoleEnum.admin]),
  validation(EV.idParamSchema, EV.updateExerciseSchema),
  ES.activateExcercise,
);

export default exerciseRoutes;

// list
// GET http://localhost:3000/exercises?page=1&size=10

// search
// GET http://localhost:3000/exercises?search=ship&page=1&size=10
