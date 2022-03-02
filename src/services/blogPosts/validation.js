import { body } from "express-validator"

export const newBlogPostValidation = [
  body("title").exists().withMessage("Title is a mandatory field!"),
  body("category").exists().withMessage("Category is a mandatory field!"),
  body("cover").exists().withMessage("Category Cover Image is a mandatory field!"),
  body("readtime").exists().withMessage("Read Time is a mandatory field!")
]

