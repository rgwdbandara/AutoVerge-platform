const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  userId: { type: String, default: null },
  message: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatHistory', ChatSchema);
