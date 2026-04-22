import {Router} from "express";
import * as US from "./user.services.js";
import validation from "../../common/middleware/Validation/validation.middleware.js";
import {authentication} from "../../common/middleware/Auth/authentication.middleware.js";
// import {authorization} from "../../common/middleware/Auth/authorization.js";
import {RoleEnum} from "../../common/enum/user.enum.js";
import {authorization} from "../../common/middleware/Auth/authorization.middleware.js";
import {updateProfileSchema} from "./user.validation.js";

const userRouter = Router();

userRouter.get("/profile", authentication, US.getProfile);
userRouter.patch(
  "/update",
  authentication,
  validation(updateProfileSchema),
  US.updateProfile,
);
userRouter.delete("/delete", authentication, US.deleteProfile);

export default userRouter;
