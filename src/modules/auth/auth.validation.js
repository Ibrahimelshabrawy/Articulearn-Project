import joi from "joi";
import {
  DifficultyLevelEnum,
  GenderEnum,
  LearningLanguageEnum,
  ProviderEnum,
  RoleEnum,
} from "../../common/enum/user.enum.js";

const providerSchema = joi.object({
  provider: joi
    .string()
    .valid(ProviderEnum.system, ProviderEnum.google)
    .default(ProviderEnum.system),
  providerId: joi.when("provider", {
    is: ProviderEnum.google,
    then: joi.string().required(),
    otherwise: joi.forbidden(),
  }),
});

export const signUpSchema = {
  body: joi
    .object({
      firstName: joi.string().min(2).max(30).trim().required(),
      lastName: joi.string().min(2).max(30).trim().required(),
      phone: joi.string().length(11),
      providers: joi.array().items(providerSchema).length(1),
      email: joi.when("providers", {
        is: joi
          .array()
          .items(
            joi.object({provider: joi.valid(ProviderEnum.system).required()}),
          ),
        then: joi.string().email({minDomainSegments: 2}).required(),
        otherwise: joi.forbidden(),
      }),
      password: joi.when("providers", {
        is: joi
          .array()
          .items(
            joi.object({provider: joi.valid(ProviderEnum.system).required()}),
          ),
        then: joi.string().min(6).required(),
        otherwise: joi.forbidden(),
      }),
      cPassword: joi.when("providers", {
        is: joi
          .array()
          .items(
            joi.object({provider: joi.string().valid(ProviderEnum.system)}),
          ),
        then: joi.string().valid(joi.ref("password")).required(),
        otherwise: joi.forbidden(),
      }),
      age: joi.number().min(3).max(100),
      gender: joi
        .string()
        .valid(GenderEnum.male, GenderEnum.female)
        .default(GenderEnum.male),

      role: joi
        .string()
        .valid(RoleEnum.parent, RoleEnum.user)
        .default(RoleEnum.user),

      parentCode: joi
        .string()
        .pattern(/^\d{6}$/)
        .optional()
        .messages({
          "string.pattern.base": "parentCode must be exactly 6 digits",
        }),
      language: joi
        .string()
        .valid(LearningLanguageEnum.english, LearningLanguageEnum.arabic)
        .default(LearningLanguageEnum.english),
      level: joi
        .string()
        .valid(
          DifficultyLevelEnum.beginner,
          DifficultyLevelEnum.intermediate,
          DifficultyLevelEnum.advanced,
        )
        .default(DifficultyLevelEnum.beginner),
      role: joi
        .string()
        .valid(RoleEnum.user, RoleEnum.admin, RoleEnum.parent)
        .default(RoleEnum.user),
      parentId: joi.string().hex().length(24).allow(null),
    })
    .required()
    .unknown(false),
};
