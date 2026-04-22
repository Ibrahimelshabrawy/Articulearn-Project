import joi from "joi";
import {
  AuthRules,
  ExerciseRules,
} from "../../common/utils/helpers/rules.validation.js";
import {objectId} from "../../common/utils/helpers/objectId.validationHelper.js";
import {GenderEnum, RoleEnum} from "../../common/enum/user.enum.js";

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

export const signUpSchema = {
  body: signInSchema.body.append({
    firstName: AuthRules.firstName.required(),
    lastName: AuthRules.lastName.required(),
    cPassword: AuthRules.cPassword.required(),
    phone: AuthRules.phone,
    gender: AuthRules.gender,
    age: AuthRules.age.required().messages({
      "any.required": "Parent Code Is Required",
    }),
    role: AuthRules.role,

    level: joi.when("role", {
      is: RoleEnum.user,
      then: AuthRules.level.required(),
      otherwise: joi.forbidden(),
    }),

    language: AuthRules.language,

    parentCode: joi
      .when("role", {
        is: RoleEnum.user,
        then: AuthRules.parentCode.required(),
        otherwise: joi.forbidden(),
      })
      .messages({
        "any.required": "Parent Code Is Required",
      }),
  }),
};
