import joi from "joi";
import {TypeEnum} from "../../common/enum/exercise.enum.js";
import {ExerciseRules} from "../../common/utils/helpers/rules.validation.js";
import {objectId} from "../../common/utils/helpers/objectId.validationHelper.js";

const baseExercise = {
  level: ExerciseRules.level,
  type: ExerciseRules.type.required(),
  language: ExerciseRules.language,
  isActive: ExerciseRules.isActive,
  title: ExerciseRules.title.required(),

  // pronunciation
  promptText: ExerciseRules.promptText,
  referenceAudioUrl: ExerciseRules.referenceAudioUrl,

  // sentence_builder
  gameAudioUrl: ExerciseRules.gameAudioUrl,
  sentenceTemplate: ExerciseRules.sentenceTemplate,
  options: ExerciseRules.options,
  correctAnswer: ExerciseRules.correctAnswer,
};

export const createExerciseSchema = {
  body: joi
    .object(baseExercise)
    .custom((value, helpers) => {
      if (value.type === TypeEnum.pronunciation) {
        if (!value.promptText)
          return helpers.message("promptText is required for pronunciation");
      }

      if (value.type === TypeEnum.sentence_builder) {
        if (!value.gameAudioUrl)
          return helpers.message(
            "gameAudioUrl is required for sentence_builder",
          );
        if (!value.sentenceTemplate)
          return helpers.message(
            "sentenceTemplate is required for sentence_builder",
          );
        if (!value.options || value.options.length < 2)
          return helpers.message("options must contain at least 2 items");
        if (!value.correctAnswer)
          return helpers.message(
            "correctAnswer is required for sentence_builder",
          );
        if (!value.options.includes(value.correctAnswer))
          return helpers.message("correctAnswer must be one of options");
      }
      return value;
    })
    .required()
    .messages({
      "any.required": "Form Is Required",
    })
    .unknown(false),
};

export const updateExerciseSchema = {
  params: objectId.id.required(),
  body: joi
    .object({
      type: ExerciseRules.type,
      level: ExerciseRules.level,
      language: ExerciseRules.language,
      title: ExerciseRules.title,
      isActive: ExerciseRules.isActive,

      // pronunciation
      promptText: ExerciseRules.promptText,
      referenceAudioUrl: ExerciseRules.referenceAudioUrl,

      // sentence_builder
      gameAudioUrl: ExerciseRules.gameAudioUrl,
      sentenceTemplate: ExerciseRules.sentenceTemplate,
      options: ExerciseRules.options,
      correctAnswer: ExerciseRules.correctAnswer,
    })
    .min(1)
    .unknown(false),
};

export const listExercisesSchema = {
  query: joi
    .object({
      type: ExerciseRules.type.required(),
      language: ExerciseRules.language,
      isActive: ExerciseRules.isActive,
      page: ExerciseRules.page,
      size: ExerciseRules.size,
    })
    .unknown(false),
};

export const deactivateOrActivateExcerciseSchema = {
  params: objectId.id.required(),
};

export const getExerciseByIDSchema = {
  params: objectId.id.required(),
};
