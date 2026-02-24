import {Router} from "express";
import * as US from "./user.services.js";
import {authentication} from "../../common/middleware/Auth/authentication.middleware.js";
// import {authorization} from "../../common/middleware/Auth/authorization.js";
import {RoleEnum} from "../../common/enum/user.enum.js";
import {authorization} from "../../common/middleware/Auth/authorization.middleware.js";

const userRouter = Router();

userRouter.get(
  "/profile",
  authentication,
  // authorization([RoleEnum.admin, RoleEnum.parent]),
  US.getProfile,
);

export default userRouter;
