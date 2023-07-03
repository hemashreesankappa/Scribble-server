const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRETE = process.env.JWT_SECRETE;

// JSON Web token implementation to authenticate user
const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    req.status(401).send({ error: "Authenticate useing valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRETE);
    req.user = data.user;
    next();
  } catch (err) {
    const error = new Error("Internal server error");
    error.statusCode = 500;
    throw error;
  }
};

module.exports = fetchUser;
