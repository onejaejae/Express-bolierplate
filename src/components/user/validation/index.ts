import { body, param } from "express-validator";
import { validatorErrorChecker } from "../../../common/validation";

export const getUserPropertiesValidator = [
  param("id")
    .notEmpty()
    .withMessage("This field is required. Please provide a value.")
    .bail(),
  validatorErrorChecker,
];
