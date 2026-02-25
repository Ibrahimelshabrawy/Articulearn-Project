import joi from "joi";
import {
  DifficultyLevelEnum,
  LearningLanguageEnum,
} from "../../common/enum/user.enum.js";
import {TypeEnum} from "../../common/enum/exercise.enum.js";

export const createExerciseSchema = {
  body: joi
    .object({
      type: joi
        .string()
        .valid(TypeEnum.game, TypeEnum.sentence, TypeEnum.word)
        .required(),
      level: joi
        .string()
        .valid(
          DifficultyLevelEnum.advanced,
          DifficultyLevelEnum.intermediate,
          DifficultyLevelEnum.beginner,
        )
        .default(DifficultyLevelEnum.beginner),
      language: joi
        .string()
        .valid(LearningLanguageEnum.arabic, LearningLanguageEnum.english)
        .default(LearningLanguageEnum.english),
      title: joi.string().trim().min(3).max(150).required(),
      promptText: joi.string().trim().min(1).max(500).required(),
      audioReferenceUrl: joi.string().trim().uri().allow(null),
      tips: joi.array().items(joi.string().trim().min(2).max(200)).default([]),
      tags: joi.array().items(joi.string().trim().min(1).max(50)),
      isActiveExercise: joi.boolean(),
    })
    .required(),
};

export const updateExerciseSchema = {
  body: joi
    .object({
      type: joi.string().valid(TypeEnum.game, TypeEnum.sentence, TypeEnum.word),
      level: joi
        .string()
        .valid(
          DifficultyLevelEnum.advanced,
          DifficultyLevelEnum.intermediate,
          DifficultyLevelEnum.beginner,
        )
        .default(DifficultyLevelEnum.beginner),
      language: joi
        .string()
        .valid(LearningLanguageEnum.arabic, LearningLanguageEnum.english)
        .default(LearningLanguageEnum.english),
      title: joi.string().trim().min(3).max(150),
      promptText: joi.string().trim().min(1).max(500),
      audioReferenceUrl: joi.string().trim().uri().allow(null),
      tips: joi.array().items(joi.string().trim().min(2).max(200)).default([]),
      tags: joi.array().items(joi.string().trim().min(1).max(50)),
      isActiveExercise: joi.boolean().default(true),
    })
    .min(1),
};

export const listExerciseQuerySchema = {
  query: joi.object({
    type: joi
      .string()
      .valid(TypeEnum.game, TypeEnum.sentence, TypeEnum.word)
      .required(),
    level: joi
      .string()
      .valid(
        DifficultyLevelEnum.advanced,
        DifficultyLevelEnum.intermediate,
        DifficultyLevelEnum.beginner,
      )
      .default(DifficultyLevelEnum.beginner),
    language: joi
      .string()
      .valid(LearningLanguageEnum.arabic, LearningLanguageEnum.english)
      .default(LearningLanguageEnum.english),
    isActiveExercise: joi.boolean(),
    search: joi.string().trim().min(1).max(80),
    page: joi.number().integer().min(1).default(1),
    limit: joi.number().min(1).max(50).default(10),
  }),
};

export const idParamSchema = {
  params: joi.object({
    id: joi.string().hex().length(24).required(),
  }),
};
