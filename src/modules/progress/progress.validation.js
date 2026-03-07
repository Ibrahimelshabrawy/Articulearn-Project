import joi from "joi";
import {objectId} from "../../utils/validation/objectId.validation.js";

export const childIdParamSchema = {
  params: joi
    .object({
      childId: objectId.required(),
    })
    .required()
    .message("Form Is Required")
    .unknown(false),
};
