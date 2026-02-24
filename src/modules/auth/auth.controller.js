import {Router} from "express";
import * as AS from "./auth.service.js";
import validation from "../../common/middleware/Validation/validation.middleware.js";
import * as AV from "./auth.validation.js";
const authRouter = Router();

authRouter.post("/signup", validation(AV.signUpSchema), AS.signUp);
authRouter.post("/signup/gmail", AS.signUpWithGmail);
authRouter.post("/signin", AS.signIn);
export default authRouter;
