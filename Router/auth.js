const express = require("express");
const router = express.Router();
const authController = require("../controller/auth");
const { check } = require("express-validator");

// Route 1 : Login user
router.post("/login", authController.postLogin);

// Route 2: Sign up new user
router.post(
  "/signup",
  [
    check("name")
      .isString()
      .isLength({ min: 1 })
      .withMessage("Name cannot be empty and cannot have special characters"),
    check("email").isEmail().withMessage("Invalid email"),
    check("password")
      .isString()
      .isLength({ min: 6 })
      .withMessage("Password should be minimum 6 characters long"),
  ],
  authController.postSignUp
);

module.exports = router;
