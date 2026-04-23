import {Router} from "express";
import {authentication} from "../../common/middleware/Auth/authentication.middleware.js";
import {
  getChildProgress,
  getPronunciationProgress,
  getSentenceBuilderProgress,
} from "./progress.service.js";
import {authorization} from "../../common/middleware/Auth/authorization.middleware.js";
import validation from "../../common/middleware/Validation/validation.middleware.js";
import {getChildProgressSchema} from "./progress.validation.js";

const progressRouter = Router({mergeParams: true});

progressRouter.get("/pronunciation", authentication, getPronunciationProgress);
progressRouter.get(
  "/sentence-builder",
  authentication,
  getSentenceBuilderProgress,
);

progressRouter.get(
  "/child-progress",
  authentication,
  validation(getChildProgressSchema),
  getChildProgress,
);
export default progressRouter;
