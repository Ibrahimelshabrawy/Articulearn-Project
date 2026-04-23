import joi from "joi";
import {objectId} from "../../common/utils/helpers/objectId.validationHelper.js";

export const getChildProgressSchema = {
  params: joi.object({
    childId: objectId.id.required(),
  }),
};
