import joi from "joi";
import {TypeEnum} from "../../common/enum/exercise.enum.js";
import {
  AttemptRules,
  ExerciseRules,
} from "../../common/utils/helpers/rules.validation.js";
import {objectId} from "../../common/utils/helpers/objectId.validationHelper.js";

export const createSentenceBuilderAttemptSchema = {
  params: joi
    .object({
      exerciseId: objectId.id.required(),
    })
    .required(),

  body: joi
    .object({
      selectedAnswer: AttemptRules.selectedAnswer,
    })
    .required()
    .unknown(false),
};

export const createPronunciationAttemptSchema = {
  params: joi
    .object({
      exerciseId: objectId.id.required(),
    })
    .required(),

  file: ExerciseRules.file.required(),
};
