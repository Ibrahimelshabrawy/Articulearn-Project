import mongoose from "mongoose";

import * as db_services from "./DB/db.services.js";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  ADMIN_PHONE,
  DB_URI,
  SALT_ROUND,
} from "../config/config.service.js";
import {RoleEnum} from "./common/enum/user.enum.js";
import userModel from "./DB/models/user.model.js";
import {Hash} from "./common/utils/Security/hash.security.js";
import {encrypt} from "./common/utils/Security/encryption.security.js";

async function createAdmin() {
  await mongoose.connect(DB_URI);

  const adminExist = await db_services.findOne({
    model: userModel,
    filter: {email: ADMIN_EMAIL},
  });
  if (adminExist) {
    console.log("Admin Already Exist");
    process.exit(0);
  }
  await db_services.create({
    model: userModel,
    data: {
      firstName: "Ibrahim",
      lastName: "Elshabrawy",
      phone: await encrypt(ADMIN_PHONE),
      email: ADMIN_EMAIL,
      password: await Hash({
        plainText: ADMIN_PASSWORD,
        salt_rounds: SALT_ROUND,
      }),
      role: RoleEnum.admin,
    },
  });
  console.log("Admin Created Successfully 🥳🥳");
  process.exit(0);
}
createAdmin().catch((err) => {
  console.log("Error Creating Admin 😥❗", err.message);
  process.exit(1);
});
