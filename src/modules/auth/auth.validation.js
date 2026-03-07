import joi from "joi";
import {
  authRules,
  ExerciseRules,
} from "../../common/utils/helpers/rules.validation.js";
import {objectId} from "../../common/utils/helpers/objectId.validationHelper.js";

export const signUpSchema = {
  body: joi
    .object({
      firstName: authRules.firstName.required(),
      lastName: authRules.lastName.required(),
      phone: authRules.phone,
      providers: authRules.providers,
      email: authRules.email,
      password: authRules.password,
      cPassword: authRules.cPassword,
      gender: authRules.gender,
      age: authRules.age,
      role: authRules.role,
      parentCode: authRules.parentCode,
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
      email: authRules.email.required(),
      password: authRules.password.required(),
    })
    .required()
    .messages({
      "any.required": "Form Is Required",
    })
    .unknown(false),
};
