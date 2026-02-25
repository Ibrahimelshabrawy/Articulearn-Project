import joi from "joi";

export const userIdParamsSchema = {
  params: joi
    .object({
      userId: joi.string().hex().length(24).required(),
    })
    .required(),
};
