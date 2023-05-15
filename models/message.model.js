const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
 
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Customer",
    required: [true, "Customer id  not added"],
  },
  conversation: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Customer",
    required: [true, "conversation id not added"],
  },
  body: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
