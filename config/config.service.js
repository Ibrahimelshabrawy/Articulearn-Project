import dotenv from "dotenv";
import {resolve} from "node:path";

const NODE_ENV = process.env.NODE_ENV;

let envPaths = {
  development: "development.env",
  production: "production.env",
};
dotenv.config({path: resolve(`config/${envPaths[NODE_ENV]}`)});

export const PORT = +process.env.PORT;
export const SALT_ROUND = +process.env.SALT_ROUND;
export const DB_URI = process.env.DB_URI;
export const DB_URI_ONLINE = process.env.DB_URI_ONLINE;
export const REDIS_URI = process.env.REDIS_URI;
export const AI_URL = process.env.AI_URL;

export const ACCESS_SECRET_KEY_USER = process.env.ACCESS_SECRET_KEY_USER;
export const ACCESS_SECRET_KEY_ADMIN = process.env.ACCESS_SECRET_KEY_ADMIN;
export const ACCESS_SECRET_KEY_PARENT = process.env.ACCESS_SECRET_KEY_PARENT;

export const ENCRYPT_SECRET_KEY = process.env.ENCRYPT_SECRET_KEY;
export const PREFIX_USER = process.env.PREFIX_USER;
export const PREFIX_ADMIN = process.env.PREFIX_ADMIN;
export const PREFIX_PARENT = process.env.PREFIX_PARENT;

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const ADMIN_PHONE = process.env.ADMIN_PHONE;

export const CLOUD_NAME = process.env.CLOUD_NAME;
export const CLOUD_API_KEY = process.env.CLOUD_API_KEY;
export const CLOUD_API_SECRET = process.env.CLOUD_API_SECRET;
