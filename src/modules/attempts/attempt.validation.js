import joi from "joi";
import {ResultStatsEnum} from "../../common/enum/attempt.enum.js";

export const createAttemptBodySchema = {
  body: joi
    .object({
      exerciseId: joi.string().hex().length(24).required(),
      durationMs: joi.number().integer().min(100).max(),
    })
    .required(),
};

export const attemptIdParamsSchema = {
  params: joi
    .object({
      id: joi.string().hex().length(24).required(),
    })
    .required(),
};
export const listAttemptsQuerySchema = {
  query: joi.object({
    exerciseId: joi.string().hex().length(24).required(),
    status: joi
      .string()
      .valid(
        ResultStatsEnum.failed,
        ResultStatsEnum.pending,
        ResultStatsEnum.success,
      )
      .default(ResultStatsEnum.pending),
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().min(1).max(50).default(10),
  }),
};
