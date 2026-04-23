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
import {
  ACCESS_SECRET_KEY_ADMIN,
  ACCESS_SECRET_KEY_PARENT,
  ACCESS_SECRET_KEY_USER,
  SALT_ROUND,
  GOOGLE_CLIENT_ID,
} from "../../../config/config.service.js";
import {resolveParentIdByCode} from "./auth.helper.js";
import {generateUniqueParentCode} from "../../common/utils/helpers/parentCode.helper.js";
import * as redis_service from "../../DB/redis/redis.services.js";

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
    parentCode,
  } = req.body;

  // check email exists
  const existing = await db_service.findOne({
    model: userModel,
    filter: {email},
    select: "_id",
    options: {lean: true},
  });

  if (existing) {
    throw new Error("Email Already Exist", {cause: 409});
  }

  let parentId = null;

  // لو child لازم parentCode
  if (role === RoleEnum.user) {
    if (!parentCode) {
      throw new Error("Parent Code Required", {cause: 400});
    }

    parentId = await resolveParentIdByCode({
      db_service,
      userModel,
      parentCode,
    });
  }

  const userData = {
    firstName,
    lastName,
    email,
    password: await Hash({
      plainText: password,
      salt_rounds: SALT_ROUND,
    }),
    gender,
    age,
    role,
    parentId,
  };

  // level خاص بالchild فقط
  if (role === RoleEnum.user) {
    userData.level = level;
  }

  // تشفير رقم الموبايل لو موجود
  if (phone) {
    userData.phone = await encrypt(phone);
  }

  // create user
  const user = await db_service.create({
    model: userModel,
    data: userData,
  });

  let parentLinkCode = null;

  // لو parent نولد له parentCode
  if (role === RoleEnum.parent) {
    parentLinkCode = await generateUniqueParentCode({
      db_service,
      userModel,
    });

    await db_service.updateOne({
      model: userModel,
      filter: {_id: user._id},
      update: {$set: {parentLinkCode}},
    });
  }

  return successResponse({
    res,
    message: "Sign Up Successfully Enjoy 🥳",
    status: 201,
    data: {
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
    },
  });
};

export const signIn = async (req, res, next) => {
  const {email, password} = req.body;
  const user = await db_service.findOne({
    model: userModel,
    filter: {email, provider: ProviderEnum.system},
    options: {lean: true},
  });

  if (!user) {
    throw new Error("User Not Found", {cause: 404});
  }

  if (
    !(await compare_match({plainText: password, cipherText: user.password}))
  ) {
    throw new Error("Invalid Password", {cause: 400});
  }

  let ACCESS_SECRET_KEY = "";
  if (user.role == RoleEnum.user) {
    ACCESS_SECRET_KEY = ACCESS_SECRET_KEY_USER;
  } else if (user.role == RoleEnum.admin) {
    ACCESS_SECRET_KEY = ACCESS_SECRET_KEY_ADMIN;
  } else if (user.role == RoleEnum.parent) {
    ACCESS_SECRET_KEY = ACCESS_SECRET_KEY_PARENT;
  } else {
    throw new Error("Invalid Role ❗", {cause: 400});
  }

  const access_token = GenerateToken({
    payload: {id: user._id},
    secret_key: ACCESS_SECRET_KEY,
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
  if (!idToken) {
    throw new Error("idToken is required", {cause: 400});
  }
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID,
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

  if (user.provider !== ProviderEnum.google) {
    throw new Error("Please Log In With System", {cause: 400});
  }

  // SignIn Steps
  const access_token = GenerateToken({
    payload: {
      id: user._id,
      email: user.email,
    },
    secret_key: ACCESS_SECRET_KEY_USER,
  });

  successResponse({
    res,
    message: "Sign In Successfully Enjoy 🥳",
    status: 200,
    data: {access_token},
  });
};

export const logout = async (req, res, next) => {
  const {flag} = req.query;
  switch (flag) {
    case LogoutEnum.all:
      req.user.changeCredential = new Date();
      await req.user.save();

      // Delete From Cache
      await redis_service.deleteKey(
        redis_service.keys(redis_service.getKeyUserId({userId: req.user._id})),
      );
      break;
    default:
      await redis_service.set({
        key: redis_service.revokeKey({
          userId: req.user._id,
          jti: req.verify.jti,
        }),
        value: `${req.verify.jti}`,
        ttl: req.verify.exp - Math.floor(Date.now() / 1000),
      });
      break;
  }
  successResponse({res});
};
