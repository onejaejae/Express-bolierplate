import { body } from "express-validator";
import { validatorErrorChecker } from "../../../common/validation/validation.error.check";

export const signUpPropertiesValidator = [
  body("email")
    .notEmpty()
    .withMessage("email field is required. Please provide a value.")
    .bail()
    .isEmail()
    .trim()
    .withMessage("email must be email format"),
  body("password").notEmpty().withMessage("비밀번호를 입력해주세요."),
  validatorErrorChecker,
];
