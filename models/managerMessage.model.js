const mongoose = require('mongoose');

const managerMessageSchema = new mongoose.Schema({
 
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Customer",
    required: [true, "Customer id  not added"],
  },
  conversation: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "ManagerConversation",
    required: [true, "manager_conversation_id not added"],
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

const ManagerMessage = mongoose.model('ManagerMessage', managerMessageSchema);

module.exports = ManagerMessage;
