import {Router} from "express";
import {authentication} from "../../common/middleware/Auth/authentication.middleware.js";
import {getChildProgress, getMyProgress} from "./progress.service.js";
import {authorization} from "../../common/middleware/Auth/authorization.middleware.js";
import validation from "../../common/middleware/Validation/validation.middleware.js";
import {getChildProgressSchema} from "./progress.validation.js";
import {RoleEnum} from "../../common/enum/user.enum.js";

const progressRouter = Router({mergeParams: true});

progressRouter.get(
  "/child-progress",
  authentication,
  validation(getChildProgressSchema),
  getChildProgress,
);

progressRouter.get("/me", authentication, getMyProgress);
export default progressRouter;
