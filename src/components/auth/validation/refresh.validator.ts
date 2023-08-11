import { body } from "express-validator";
import { validatorErrorChecker } from "../../../common/validation";

export const refreshPropertiesValidator = [
  body("accessToken")
    .notEmpty()
    .withMessage("accessToken field is required. Please provide a value.")
    .bail()
    .isString()
    .trim()
    .withMessage("accessToken must be email format"),
  body("refreshToken")
    .notEmpty()
    .withMessage("refreshToken field is required. Please provide a value.")
    .bail()
    .isString()
    .trim()
    .withMessage("refreshToken must be email format"),
  validatorErrorChecker,
];
