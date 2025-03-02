const mongoose = require('mongoose');

// Note Schema definition
const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'This field is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'This field is required'],
    minlength: [10, 'This field must be at least 10 characters'],
    maxlength: [1000, 'Field must be less than 1000 characters'],
    trim: true,
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' },
}, { timestamps: true });

// Create a Mongoose model for the Note schema
const note = mongoose.model('Note', noteSchema);

module.exports = note;
