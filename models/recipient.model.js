const mongoose = require('mongoose');

const recipientSchema = new mongoose.Schema({
 
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
    required: [true, "user id  not added"],
  },
  message: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Message",
    required: [true, "message id  not added"],
  },
  conversation: {
    type: mongoose.SchemaTypes.ObjectId,
    required: [true, "conversation id  not added"],
  },
  read_at: {
    type: Date,
    default: null,
  },
});

const Recipient = mongoose.model('Recipient', recipientSchema);

module.exports = Recipient;
