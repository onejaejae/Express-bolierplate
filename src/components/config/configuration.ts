import { Configurations } from "../../types/config";
import dotenv from "dotenv";

const envFound = dotenv.config({ path: `dotenv/.env.${process.env.NODE_ENV}` });
if (envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export const configurations = (): Configurations => {
  const currentEnv = process.env.NODE_ENV || "local";

  return {
    APP: {
      PORT: process.env.PORT || 6000,
      ENV: currentEnv,
      NAME: process.env.NAME || "Express",
      BASE_URL: process.env.BASE_URL || "http://localhost",
    },
    DB: {
      DB_USER_NAME: process.env.DB_USER_NAME || "",
      DB_PASSWORD: process.env.DB_PASSWORD || "",
      DB_DATABASE: process.env.DB_DATABASE || "",
      DB_PORT: process.env.DB_PORT || 3306,
    },
  };
};