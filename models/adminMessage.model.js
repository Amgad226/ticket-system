const mongoose = require('mongoose');

const adminMessageSchema = new mongoose.Schema({
 
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Customer",
    required: [true, "Customer id  not added"],
  },
  conversation: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "AdminConversation",
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

const AdminMessage = mongoose.model('AdminMessage', adminMessageSchema);

module.exports = AdminMessage;
