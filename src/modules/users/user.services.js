import {successResponse} from "../../common/utils/response/success.response.js";
export const getProfile = async (req, res, next) => {
  successResponse({
    res,
    status: 200,
    message: "User Profile",
    data: req.user,
  });
};
