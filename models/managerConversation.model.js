const mongoose = require('mongoose');

const managerConversationSchema = new mongoose.Schema({

  ticket: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Ticket",
    required: [true, "Ticket id not added"],
  },
  last_message_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Message",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  active: {
    type: Boolean,
    default: false,
  },

});

const ManagerConversation = mongoose.model('ManagerConversation', managerConversationSchema);

module.exports = ManagerConversation;
