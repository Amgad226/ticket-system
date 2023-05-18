const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  access: {
    type: String,
    required: true,
    unique: true
  },
  refresh: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    required: true,
    // unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1d' // automatically remove expired entries after 30 days
  }
});

const Tokens = mongoose.model('Tokens', tokenSchema);

module.exports = Tokens;
