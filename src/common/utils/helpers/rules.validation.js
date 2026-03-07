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
  referenceAudioUrl: joi.string().uri().allow(null),

  // sentence_builder
  gameAudioUrl: joi.string().uri().allow(null),
  sentenceTemplate: joi.string().trim().min(1).allow(null),
  options: joi.array().items(joi.string().trim().min(1)).default([]),
  correctAnswer: joi.string().trim().min(1).allow(null),
};

export const providerRules = {
  provider: joi
    .string()
    .valid(...Object.values(ProviderEnum))
    .default(ProviderEnum.system),
  providerId: joi.when("provider", {
    is: ProviderEnum.google,
    then: joi.string().required(),
    otherwise: joi.forbidden(),
  }),
};

export const authRules = {
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
  providers: joi.array().items(providerRules).length(1),
  email: joi
    .when("providers", {
      is: joi
        .array()
        .items(
          joi.object({provider: joi.valid(ProviderEnum.system).required()}),
        ),
      then: joi.string().email({minDomainSegments: 2}).required(),
      otherwise: joi.forbidden(),
    })
    .messages({
      "any.required": "Email is required",
      "string.email": "Email must be in email format (example@mail.com)",
    }),
  password: joi
    .when("providers", {
      is: joi
        .array()
        .items(
          joi.object({provider: joi.valid(ProviderEnum.system).required()}),
        ),
      then: joi.string().min(6).required(),
      otherwise: joi.forbidden(),
    })
    .messages({
      "any.required": "Password is required",
      "string.min": "Password must be greater than 5 chars",
    }),
  cPassword: joi
    .when("providers", {
      is: joi
        .array()
        .items(joi.object({provider: joi.string().valid(ProviderEnum.system)})),
      then: joi.string().valid(joi.ref("password")).required(),
      otherwise: joi.forbidden(),
    })
    .messages({
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

  parentCode: joi
    .string()
    .pattern(/^\d{6}$/)
    .optional()
    .messages({
      "string.pattern.base": "parentCode must be exactly 6 digits",
    }),
  parentId: joi.string().hex().length(24).allow(null),
};
