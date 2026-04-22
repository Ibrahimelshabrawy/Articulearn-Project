import joi from "joi";
import {TypeEnum} from "../../enum/exercise.enum.js";
import {
  DifficultyLevelEnum,
  GenderEnum,
  LearningLanguageEnum,
  ProviderEnum,
  RoleEnum,
} from "../../enum/user.enum.js";

export const ExerciseRules = {
  type: joi
    .string()
    .valid(...Object.values(TypeEnum))
    .messages({
      "any.required": "Type is required",
      "any.only": "Types must be one of [sentence_builder, pronunciation]",
    }),
  level: joi
    .string()
    .valid(...Object.values(DifficultyLevelEnum))
    .default(DifficultyLevelEnum.beginner),

  language: joi
    .string()
    .valid(...Object.values(LearningLanguageEnum))
    .default(LearningLanguageEnum.english),

  title: joi.string().trim().min(3).max(120),

  isActive: joi.boolean().default(true),
  page: joi.number().integer().min(1).default(1),
  size: joi.number().integer().min(1).max(50).default(10),

  // pronunciation
  promptText: joi.string().trim().min(1).allow(null),

  // sentence_builder
  sentenceTemplate: joi.string().trim().min(1).allow(null),
  options: joi.string(),
  correctAnswer: joi.string().trim().min(1).allow(null),

  file: joi
    .object({
      fieldname: joi.string(),
      originalname: joi.string(),
      encoding: joi.string(),
      mimetype: joi.string(),
      destination: joi.string(),
      filename: joi.string(),
      path: joi.string(),
      size: joi.number(),
    })
    .messages({
      "any.required": "File is required",
    }),
};

export const AuthRules = {
  firstName: joi.string().min(2).max(30).trim().messages({
    "any.required": "First Name is required",
    "string.min": "firstName length must be at least 2 characters",
    "string.max": "firstName length must be at Most 30 characters",
  }),
  lastName: joi.string().min(2).max(30).trim().messages({
    "any.required": "First Name is required",
    "string.min": "firstName length must be at least 2 characters",
    "string.max": "firstName length must be at Most 30 characters",
  }),
  phone: joi
    .string()
    .length(11)
    .pattern(/^01[0125]\d{8}$/)
    .messages({
      "string.pattern.base":
        "Phone must be a valid Egyptian mobile number , start with (010 , 011 , 012, 015)",
      "string.length": "Phone Number must be in length 11 number",
    }),
  providers: joi.string().valid(...Object.values(ProviderEnum)),
  email: joi.string().email().messages({
    "any.required": "Email is required",
    "string.email": "Email must be in email format (example@mail.com)",
  }),
  password: joi.string().required().messages({
    "any.required": "Password is required",
    "string.min": "Password must be greater than 5 chars",
  }),
  cPassword: joi.string().valid(joi.ref("password")).required().messages({
    "any.required": "Confirm Password is required",
    "any.only": "Confirm password must match password",
  }),
  age: joi.number().min(3).max(100),
  gender: joi
    .string()
    .valid(...Object.values(GenderEnum))
    .default(GenderEnum.male),
  role: joi
    .string()
    .valid(...Object.values(RoleEnum))
    .default(RoleEnum.user),

  level: joi
    .string()
    .valid(...Object.values(DifficultyLevelEnum))
    .default(DifficultyLevelEnum.beginner),

  language: joi.string().valid(...Object.values(LearningLanguageEnum)),

  parentCode: joi
    .string()
    .pattern(/^\d{6}$/)
    .optional()
    .messages({
      "string.pattern.base": "parentCode must be exactly 6 digits",
    }),
  parentId: joi.string().hex().length(24).allow(null),
};

export const AttemptRules = {
  durationMs: joi.number().integer().min(0),
  // sentence_builder submission
  selectedAnswer: joi.string().trim().min(1),
};
