import {ProviderEnum, RoleEnum} from "../../common/enum/user.enum.js";
import {successResponse} from "../../common/utils/response/success.response.js";
import * as db_service from "../../DB/db.services.js";
import userModel from "../../DB/models/user.model.js";
import {
  compare_match,
  Hash,
} from "../../common/utils/Security/hash.security.js";
import {encrypt} from "../../common/utils/Security/encryption.security.js";
import {GenerateToken} from "../../common/utils/jwt/token.service.js";

import {OAuth2Client} from "google-auth-library";
import {SALT_ROUND, SECRET_KEY} from "../../../config/config.service.js";
import {resolveParentIdByCode} from "./auth.helper.js";
import {generateUniqueParentCode} from "../../common/utils/helpers/parentCode.helper.js";

export const signUp = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    gender,
    age,
    role = RoleEnum.user,
    level,
    language,
    providers,
    parentCode,
  } = req.body;

  const existing = await db_service.findOne({
    model: userModel,
    filter: {email},
    select: "_id",
    options: {lean: true},
  });

  if (existing) throw new Error("Email Already Exist", {cause: 409});

  let parentId = null;
  if (role === RoleEnum.user && parentCode) {
    parentId = await resolveParentIdByCode({db_service, userModel, parentCode});
  }

  const userData = {
    firstName,
    lastName,
    email,
    password: await Hash({plainText: password, salt_rounds: SALT_ROUND}),
    gender,
    age,
    role,
    level,
    language,
    providers,
    parentId,
  };

  if (phone) userData.phone = await encrypt(phone);

  // 4) create user
  const user = await db_service.create({
    model: userModel,
    data: userData,
  });
  let parentLinkCode = null;
  if (role === RoleEnum.parent) {
    parentLinkCode = await generateUniqueParentCode({db_service, userModel});

    await db_service.updateOne({
      model: userModel,
      filter: {_id: user._id},
      update: {$set: {parentLinkCode}},
    });
  }

  const responsePayload = {
    _id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    level: user.level,
    language: user.language,
    gender: user.gender,
    age: user.age,
    parentId: user.parentId ?? undefined,
    ...(parentLinkCode ? {parentLinkCode} : {}),
  };

  return successResponse({
    res,
    message: "Sign Up Successfully Enjoy 🥳",
    status: 200,
    data: responsePayload,
  });
};

export const signIn = async (req, res, next) => {
  const {email, password} = req.body;
  const user = await db_service.findOne({
    model: userModel,
    filter: {email, provider: ProviderEnum.system},
    options: {lean: true},
  });

  console.log(user);

  if (!user) {
    throw new Error("User Not Found", {cause: 404});
  }

  if (
    !(await compare_match({plainText: password, cipherText: user.password}))
  ) {
    throw new Error("Invalid Password", {cause: 400});
  }

  const access_token = GenerateToken({
    payload: {id: user._id},
    secret_key: SECRET_KEY,
  });

  successResponse({
    res,
    message: "Sign In Successfully Enjoy 🥳",
    status: 200,
    data: {access_token},
  });
};

export const signUpWithGmail = async (req, res, next) => {
  const {idToken} = req.body;
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience:
      "694984628962-f9voepvf2qrj0abb03epi4uln12stb08.apps.googleusercontent.com",
  });
  const payload = ticket.getPayload();

  const {sub, email, email_verified, name, picture} = payload;

  // SignUp Steps
  let user = await db_service.findOne({
    model: userModel,
    filter: {email},
  });
  if (!user) {
    user = await db_service.create({
      model: userModel,
      data: {
        email,
        confirmed: email_verified,
        userName: name,
        profilePicture: picture,
        provider: ProviderEnum.google,
      },
    });
  }

  if (user.provider == ProviderEnum.system) {
    throw new Error("Please Log In With System", {cause: 400});
  }

  // SignIn Steps
  const access_token = GenerateToken({
    payload: {
      id: user.id,
      email: user.email,
    },
    secret_key: SECRET_KEY,
  });

  successResponse({
    res,
    message: "Sign In Successfully Enjoy 🥳",
    status: 200,
    data: {access_token},
  });
};
