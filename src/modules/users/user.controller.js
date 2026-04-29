import {Router} from "express";
import * as US from "./user.services.js";
import validation from "../../common/middleware/Validation/validation.middleware.js";
import {authentication} from "../../common/middleware/Auth/authentication.middleware.js";
// import {authorization} from "../../common/middleware/Auth/authorization.js";
import {RoleEnum} from "../../common/enum/user.enum.js";
import {authorization} from "../../common/middleware/Auth/authorization.middleware.js";
import {updateProfileSchema} from "./user.validation.js";
import progressRouter from "../progress/progress.controller.js";

const userRouter = Router();

userRouter.get("/profile", authentication, US.getProfile);
userRouter.get(
  "/parent/children",
  authentication,
  authorization([RoleEnum.parent]),
  US.getChildrenProfiles,
);

userRouter.patch(
  "/update",
  authentication,
  validation(updateProfileSchema),
  US.updateProfile,
);
userRouter.delete("/delete", authentication, US.deleteProfile);
userRouter.get(
  "/parent/code",
  authentication,
  authorization([RoleEnum.parent]),
  US.getParentCode,
);

userRouter.use("/parent/child/:childId", progressRouter);

export default userRouter;
