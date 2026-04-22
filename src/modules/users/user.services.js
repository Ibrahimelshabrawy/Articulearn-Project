import {RoleEnum} from "../../common/enum/user.enum.js";
import {successResponse} from "../../common/utils/response/success.response.js";
import * as db_service from "../../DB/db.services.js";
import attemptModel from "../../DB/models/attempt.model.js";
import progressModel from "../../DB/models/progress.model.js";
import userModel from "../../DB/models/user.model.js";

export const getProfile = async (req, res, next) => {
  successResponse({
    res,
    status: 200,
    message: "User Profile",
    data: req.user,
  });
};

export const updateProfile = async (req, res, next) => {
  const {firstName, lastName, phone, gender, age} = req.body;

  const userExist = await db_service.findById({
    model: userModel,
    id: req.user._id,
  });
  if (!userExist) {
    throw new Error("User Not Exist", {cause: 404});
  }

  const user = await db_service.findOneAndUpdate({
    model: userModel,
    filter: {_id: req.user._id},
    update: {firstName, lastName, phone, gender, age},
    options: {
      lean: true,
    },
  });
  successResponse({
    res,
    message: "User Updated Successfully 🥳",
    status: 200,
    data: {user},
  });
};

export const deleteProfile = async (req, res, next) => {
  const userId = req.user._id;

  const user = await db_service.findOne({
    model: userModel,
    filter: {_id: userId},
  });

  if (!user) {
    throw new Error("User Not Found", {cause: 404});
  }

  await db_service.deleteMany({
    model: attemptModel,
    filter: {userId},
  });

  await db_service.deleteMany({
    model: progressModel,
    filter: {userId},
  });

  if (user.role === RoleEnum.parent) {
    const children = await db_service.find({
      model: userModel,
      filter: {parentId: userId},
    });

    const childrenIds = children.map((child) => child._id);

    if (childrenIds.length) {
      await db_service.deleteMany({
        model: attemptModel,
        filter: {userId: {$in: childrenIds}},
      });

      await db_service.deleteMany({
        model: progressModel,
        filter: {userId: {$in: childrenIds}},
      });

      await db_service.deleteMany({
        model: userModel,
        filter: {parentId: userId},
      });
    }
  }

  await db_service.deleteOne({
    model: userModel,
    filter: {_id: userId},
  });

  return successResponse({
    res,
    status: 200,
    message: "Profile deleted successfully 🗑️",
  });
};
