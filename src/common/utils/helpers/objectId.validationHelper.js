import joi from "joi";
import {Types} from "mongoose";

export const objectId = {
  id: joi.custom((value, helper) => {
    const isValid = Types.ObjectId.isValid(value);
    return isValid ? value : helper.message("Invalid ID 😥");
  }),
};
