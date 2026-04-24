import express from "express";
import checkConnection from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";
import cors from "cors";
import authRouter from "./modules/auth/auth.controller.js";
import exerciseRoutes from "./modules/exercises/exercise.controller.js";
import attemptRoute from "./modules/attempts/attempt.controller.js";
import {redisConnection} from "./DB/redis/redis.db.js";
import progressRouter from "./modules/progress/progress.controller.js";
import helmet from "helmet";
import {rateLimit} from "express-rate-limit";

const app = express();
const port = process.env.PORT;

const bootstrap = () => {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
  });

  app.use(cors({origin: "*"}));
  app.use(helmet(), limiter, express.json());
  app.get("/", (req, res) => res.send("Welcome To Our Application 🥳"));
  checkConnection();
  redisConnection();

  app.use("/users", userRouter);
  app.use("/auth", authRouter);
  app.use("/exercises", exerciseRoutes);
  app.use("/attempt", attemptRoute);
  app.use("/progress", progressRouter);

  app.use("{/*demo}", (req, res, next) => {
    throw new Error("`The URL ${req.originalUrl} Is Not Found 😥`", {
      cause: 500,
    });
  });

  app.use((err, req, res, next) => {
    // console.error(err.stack);
    res.status(err.cause || 500).json({message: err.message, stack: err.stack});
  });

  app.listen(port, () =>
    console.log(`Articulearn app listening on port ${port}!`),
  );
};
export default bootstrap;
