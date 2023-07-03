const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRETE = process.env.JWT_SECRETE;

/////  Login user controller ///////
exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(401).json({ message: errors.array()[0].msg });
  }

  try {
    // Throw error if email does not exists
    const userData = await User.findOne({ email: email });
    if (!userData) {
      const error = new Error(
        "No account found for this email. If not registered yet, please sign up"
      );
      error.statusCode = 401;
      throw error;
    }
    // Verify password
    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const data = {
      user: { id: userData._id },
    };
    // Send authtoken to client
    const authToken = jwt.sign(data, JWT_SECRETE);
    res.status(200).json({ authToken, statusCode: 200 });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

///// Sign up user controller //////////////
exports.postSignUp = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(401).json({ message: errors.array()[0].msg });
  }

  try {
    if (password !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 422;
      throw error;
    }
    // Encrypt password to store in DB
    const encryptedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name,
      email: email,
      password: encryptedPassword,
    });
    // Check if email already exists
    const userRes = await User.findOne({ email: email });

    if (userRes) {
      const error = new Error("Email address already exists");
      error.statusCode = 422;
      throw error;
    }
    // Save user details to db
    const result = await user.save();

    res.status(200).json({ message: "Sign up successfull", statusCode: 200 });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
