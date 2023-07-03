require("dotenv").config();
const express = require("express");
const app = express();
var cors = require("cors");
const authRoute = require("./Router/auth");
const noteRoute = require("./Router/note");
const mongoose = require("mongoose");
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/note", noteRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;

  res.status(status).json({
    status: status,
    message: err.message,
  });
});

// Connect to DB
mongoose
  .connect(process.env.DB_URL)
  .then((result) => {
    app.listen(PORT);
    console.log("Journal app started");
  })
  .catch((err) => {
    console.log(err);
  });
