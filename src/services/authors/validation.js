import { body } from "express-validator"

export const newAuthorValidation = [
    body("email").isEmail().withMessage("Email is not in the right format!"),
    body("category").exists().withMessage("Category is a mandatory field!"),
]

