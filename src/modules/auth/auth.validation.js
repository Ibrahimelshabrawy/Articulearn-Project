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
      userName: joi
        .string()
        .pattern(/^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/)
        .min(3)
        .max(40)
        .required()
        .messages({
          "string.pattern.base":
            "Username must contain letters and spaces only",
        }),
      phone: joi.string().length(11),
      providers: joi.array().items(providerSchema).length(1).required(),
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
      settings: joi.object({
        learningLanguage: joi
          .string()
          .valid(LearningLanguageEnum.english, LearningLanguageEnum.arabic)
          .default(LearningLanguageEnum.english),
        difficultyLevel: joi
          .string()
          .valid(
            DifficultyLevelEnum.beginner,
            DifficultyLevelEnum.intermediate,
            DifficultyLevelEnum.advanced,
          )
          .default(DifficultyLevelEnum.beginner),
      }),
      role: joi
        .string()
        .valid(RoleEnum.user, RoleEnum.admin, RoleEnum.parent)
        .default(RoleEnum.user),
      parentId: joi.string().hex().length(24).allow(null),
    })
    .required(),
};
