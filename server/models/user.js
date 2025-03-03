const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: [true, 'This field is required'], 
    unique: true,
    trim: true,},
  email: { 
    type: String, 
    required: [true, 'This field is required'], 
    unique: [true, 'The email is already taken'] },
  password: { 
    type: String, 
    required: [true, 'This field is required'],
    minlength: [5, 'This field must be at least 5 characters'] },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
