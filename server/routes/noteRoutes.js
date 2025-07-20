const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require('../controllers/noteController');

// Require authentication for every /notes route
router.use(isAuthenticated);

// CRUD routes
router.post('/',    createNote);
router.get('/',     getNotes);
router.get('/:id',  getNoteById);
router.put('/:id',  updateNote);
router.delete('/:id', deleteNote);

module.exports = router;
