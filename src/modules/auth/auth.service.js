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

export const signUp = async (req, res, next) => {
  const {
    userName,
    email,
    cPassword,
    password,
    gender,
    phone,
    role,
    age,
    parentId,
    stats,
    difficultyLevel,
    settings,
    providers,
  } = req.body;

  const {provider, providerId} = providers?.[0];

  let hashedPassword = undefined;
  let encryptPhone = undefined;

  if (provider === ProviderEnum.system) {
    if (await db_service.findOne({model: userModel, filter: {email}})) {
      throw new Error("Email Already Exist", {cause: 409});
    }
    hashedPassword = await Hash({plainText: password, salt_rounds: SALT_ROUND});
    encryptPhone = await encrypt(phone);
  } else {
    await db_service.findOne({
      model: userModel,
      filter: {
        "providers.provider": provider,
        "providers.providerId": providerId,
      },
    });
  }

  const user = await db_service.create({
    model: userModel,
    data: {
      userName,
      email,
      cPassword,
      password: hashedPassword,
      gender,
      phone: encryptPhone,
      role,
      age,
      parentId,
      stats,
      difficultyLevel,
      settings,
      providers,
    },
  });
  successResponse({
    res,
    message: "Sign Up Successfully Enjoy 🥳",
    status: 200,
    data: user,
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

  const {email, email_verified, name, picture} = payload;

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
