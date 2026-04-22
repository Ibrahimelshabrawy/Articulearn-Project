import joi from "joi";
import {TypeEnum} from "../../common/enum/exercise.enum.js";
import {ExerciseRules} from "../../common/utils/helpers/rules.validation.js";
import {objectId} from "../../common/utils/helpers/objectId.validationHelper.js";

export const createPronunciationExerciseSchema = {
  body: joi.object({
    level: ExerciseRules.level,
    language: ExerciseRules.language,
    title: ExerciseRules.title.required(),
    promptText: ExerciseRules.promptText.required(),
    isActive: ExerciseRules.isActive,
  }),
  file: ExerciseRules.file.required(),
};

export const createSentenceBuilderExerciseSchema = {
  body: joi.object({
    level: ExerciseRules.level,
    language: ExerciseRules.language,
    title: ExerciseRules.title.required(),
    sentenceTemplate: ExerciseRules.sentenceTemplate.required(),
    options: ExerciseRules.options.required(),
    correctAnswer: ExerciseRules.correctAnswer.required(),
    isActive: ExerciseRules.isActive,
  }),
  file: ExerciseRules.file.required(),
};

export const updateSentenceBuilderExerciseSchema = {
  body: joi
    .object({
      level: ExerciseRules.level,
      language: ExerciseRules.language,
      title: ExerciseRules.title,
      sentenceTemplate: ExerciseRules.sentenceTemplate,
      options: ExerciseRules.options,
      correctAnswer: ExerciseRules.correctAnswer,
      isActive: ExerciseRules.isActive,
    })
    .min(1),
  file: ExerciseRules.file,
  params: objectId.id.required(),
};

export const updatePronunciationExerciseSchema = {
  body: joi
    .object({
      level: ExerciseRules.level,
      language: ExerciseRules.language,
      title: ExerciseRules.title,
      promptText: ExerciseRules.promptText,
      isActive: ExerciseRules.isActive,
    })
    .min(1),
  file: ExerciseRules.file,
  params: objectId.id.required(),
};

export const getExercisesByTypeAndLevelSchema = {
  query: joi
    .object({
      page: ExerciseRules.page,
      size: ExerciseRules.size,
    })
    .unknown(false),
  params: joi.object({
    type: ExerciseRules.type.required(),
    level: ExerciseRules.level.required(),
  }),
};

export const deactivateOrActivateExcerciseSchema = {
  params: objectId.id.required(),
};

export const getExerciseByIDSchema = {
  params: objectId.id.required(),
};
