import { body } from "express-validator";
import { validatorErrorChecker } from "../../../common/validation/validation.error.check";

export const createPostPropertiesValidator = [
  body("title")
    .notEmpty()
    .withMessage("title field is required. Please provide a value.")
    .bail()
    .isString()
    .trim()
    .withMessage("title must be string type"),
  body("content")
    .notEmpty()
    .withMessage("content field is required. Please provide a value.")
    .bail()
    .isString()
    .trim()
    .withMessage("content must be string type"),
  validatorErrorChecker,
];
