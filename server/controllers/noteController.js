const Note = require('../models/note');

// POST /notes
exports.createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const note = new Note({ title, content, user: userId });
    await note.save();

    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET /notes
exports.getNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const notes = await Note.find({ user: userId })
                            .populate('user', 'username email');
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /notes/:id
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOne({ _id: id, user: userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// PUT /notes/:id
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { title, content } = req.body;

    const note = await Note.findOneAndUpdate(
      { _id: id, user: userId },
      { title, content },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ error: 'Note not found' });

    res.status(200).json(note);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE /notes/:id
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const note = await Note.findOneAndDelete({ _id: id, user: userId });
    if (!note) return res.status(404).json({ error: 'Note not found' });

    res.status(200).json({ message: 'Note deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
