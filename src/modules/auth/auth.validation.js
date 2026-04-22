import joi from "joi";
import {
  AuthRules,
  ExerciseRules,
} from "../../common/utils/helpers/rules.validation.js";
import {objectId} from "../../common/utils/helpers/objectId.validationHelper.js";

export const signUpSchema = {
  body: joi
    .object({
      firstName: AuthRules.firstName.required(),
      lastName: AuthRules.lastName.required(),
      phone: AuthRules.phone,
      providers: AuthRules.providers,
      email: AuthRules.email,
      password: AuthRules.password,
      cPassword: AuthRules.cPassword,
      gender: AuthRules.gender,
      age: AuthRules.age,
      role: AuthRules.role,
      parentCode: AuthRules.parentCode,
      language: ExerciseRules.language,
      level: ExerciseRules.level,
      parentId: objectId.id,
    })
    .required()
    .messages({
      "any.required": "Form Is Required",
    })
    .unknown(false),
};

export const signInSchema = {
  body: joi
    .object({
      email: AuthRules.email.required(),
      password: AuthRules.password.required(),
    })
    .required()
    .messages({
      "any.required": "Form Is Required",
    })
    .unknown(false),
};
