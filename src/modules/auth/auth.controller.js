import {Router} from "express";
import * as AS from "./auth.service.js";
const authRouter = Router();

authRouter.post("/signup", AS.signUp);
authRouter.post("/signup/gmail", AS.signUpWithGmail);
authRouter.post("/signin", AS.signIn);
export default authRouter;
