const noteModel = require('../models/note');
const userModel = require('../models/user');

const createNote = async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    const user = await userModel.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const note = new note({ user: userId, title, content });
    await note.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await noteModel.find().populate('user', 'username email');
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNoteById = async (req, res) => {
    try {
      const { id } = req.params;
      const note = await noteModel.findById(id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(200).json(note);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const updateNote = async (req, res) => {
    try {
      const { id } = req.params;
      const { title, content } = req.body;
      const note = await noteModel.findByIdAndUpdate(
        id,
        { title, content },
        { new: true, runValidators: true }
      );
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(200).json(note);
    } catch (err) {
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).json({ error: 'Server error' });
    }
  };
  
  const deleteNote = async (req, res) => {
    try {
      const { id } = req.params;
      const note = await noteModel.findByIdAndDelete(id);
      if (!note) {
        return res.status(404).json({ error: 'Note not found' });
      }
      res.status(200).json({ message: 'Note deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  };

module.exports = {
    createNote: createNote, 
    getNotes: getNotes,
    getNoteById: getNoteById,
    updateNote: updateNote,
    deleteNote: deleteNote,
};