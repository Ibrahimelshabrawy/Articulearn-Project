import joi from "joi";
import {AuthRules} from "../../common/utils/helpers/rules.validation.js";

export const updateProfileSchema = {
  body: joi
    .object({
      firstName: AuthRules.firstName,
      lastName: AuthRules.lastName,
      age: AuthRules.age,
      gender: AuthRules.gender,
      phone: AuthRules.phone,
    })
    .min(1),
};
