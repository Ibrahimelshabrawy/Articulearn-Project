import {RoleEnum} from "../../common/enum/user.enum.js";

export const resolveParentIdByCode = async ({
  db_service,
  userModel,
  parentCode,
}) => {
  const parent = await db_service.findOne({
    model: userModel,
    filter: {parentLinkCode: parentCode, role: RoleEnum.parent},
    select: "_id",
    options: {lean: true},
  });

  if (!parent) {
    throw new Error("Invalid parent code", {cause: 400});
  }

  return parent._id;
};
