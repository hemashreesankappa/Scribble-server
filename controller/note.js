const Note = require("../models/note");
const { validationResult } = require("express-validator");

///// ADD NEW NOTE CONTROLLER //////////////
exports.addNote = async (req, res, next) => {
  const text = req.body.text;
  const mood = req.body.mood;
  const userId = req.user.id;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const newNote = new Note({ text: text, mood: mood, user: userId });
    // Save note to database
    const result = await newNote.save();
    res.send({ status: 200, message: "Notes save success" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

///// FETCH ALL NOTES OF LOGGED IN USER //////////////
exports.fetchNotes = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const notes = await Note.find({ user: userId }).sort({ createdAt: -1 });
    res.send({ status: 200, notes: notes });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

///// DELETE A NOTE //////////////
exports.deleteNote = async (req, res, next) => {
  const noteId = req.params.id;

  try {
    let note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).send({ message: "Note not found" });
    }

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send({ message: "Not authorized to delete" });
    }

    note = await Note.findByIdAndDelete(noteId);

    res.send({ status: 200, message: "Note deleted successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};

///// UPDATE EXISTING NOTE //////////////
exports.updateNote = async (req, res, next) => {
  const eText = req.body.eText;
  const userId = req.user.id;
  const noteId = req.params.id;
  const newNote = {};
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    newNote.text = eText;

    let note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).send({ message: "Note not found" });
    }

    if (note.user.toString() !== userId) {
      return res.status(401).send({ message: "Not authorized to delete" });
    }

    note = await Note.findByIdAndUpdate(
      { _id: noteId },
      { $set: newNote },
      { new: true }
    );
    res
      .status(200)
      .send({ status: 200, message: "Note updated successfully!" });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};
