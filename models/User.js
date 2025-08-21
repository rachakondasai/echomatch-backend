const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  gender: String,
  location: String,
  language: String,
  password: String,
  isOnline: Boolean,
  socketId: String
});

module.exports = mongoose.model('User', UserSchema);