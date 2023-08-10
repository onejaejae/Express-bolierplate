import { body } from "express-validator";
import { validatorErrorChecker } from "../../../common/validation";

export const signUpPropertiesValidator = [
  body("name")
    .notEmpty()
    .withMessage("This field is required. Please provide a value.")
    .bail()
    .isString()
    .trim()
    .withMessage("name must be string"),
  validatorErrorChecker,
];
