import joi from "joi";
import {objectId} from "../../utils/validation/objectId.validation.js";
import {TypeEnum} from "../../common/enum/exercise.enum.js";

export const createAttemptSchema = joi
  .object({
    exerciseId: objectId.required(),

    type: joi
      .string()
      .valid(TypeEnum.pronunciation, TypeEnum.sentence_builder)
      .required(),

    // pronunciation submission
    audioUrl: joi.string().uri().allow(null),
    durationMs: joi.number().integer().min(0).allow(null),

    // sentence_builder submission
    selectedAnswer: joi.string().trim().min(1).allow(null),
  })
  .custom((value, helpers) => {
    if (value.type === TypeEnum.pronunciation) {
      if (!value.audioUrl)
        return helpers.error("any.custom", {
          message: "audioUrl is required for pronunciation attempt",
        });
    }

    if (value.type === TypeEnum.sentence_builder) {
      if (!value.selectedAnswer)
        return helpers.error("any.custom", {
          message: "selectedAnswer is required for sentence_builder attempt",
        });
    }

    return value;
  })
  .required()
  .messages({"any.custom": "Form Is Required"})
  .unknown(false);

export const listAttemptsQuerySchema = joi
  .object({
    exerciseId: objectId,
    type: joi
      .string()
      .valid(TypeEnum.pronunciation, TypeEnum.sentence_builder)
      .required(),
    page: joi.number().integer().min(1).default(1),
    size: joi.number().integer().min(1).max(50).default(10),
  })
  .unknown(false);
