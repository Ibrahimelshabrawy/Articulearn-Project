import {Router} from "express";
import * as AV from "./attempt.validation.js";
import * as AS from "./attempt.service.js";
import {authentication} from "../../common/middleware/Auth/authentication.middleware.js";
import validation from "../../common/middleware/Validation/validation.middleware.js";
import {authorization} from "../../common/middleware/Auth/authorization.middleware.js";
import {RoleEnum} from "../../common/enum/user.enum.js";
import multer_host from "../../common/middleware/multer/multer.js";
import {MulterEnum} from "../../common/enum/multer.enum.js";

const attemptRoute = Router({mergeParams: true});

attemptRoute.post(
  "/create-sentence-builder",
  authentication,
  authorization(RoleEnum.user),
  validation(AV.createSentenceBuilderAttemptSchema),
  AS.createSentenceBuilderAttempt,
);

attemptRoute.post(
  "/pronunciation",
  authentication,
  authorization(RoleEnum.user),
  multer_host([...MulterEnum.audio]).single("audioUrl"),
  validation(AV.createPronunciationAttemptSchema),
  AS.createPronunciationAttempt,
);

export default attemptRoute;
