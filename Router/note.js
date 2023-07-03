const noteController = require("../controller/note");
const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchuser");
const { body } = require("express-validator");

router.post(
  "/add",
  fetchUser,
  [body("text", "Note cannot be empty").isLength({ min: 1 })],
  noteController.addNote
);

router.get("/fetchNotes", fetchUser, noteController.fetchNotes);

router.delete("/deleteNote/:id", fetchUser, noteController.deleteNote);

router.put(
  "/updateNote/:id",
  fetchUser,
  [body("text", "Note cannot be empty").isEmpty()],
  noteController.updateNote
);

module.exports = router;
