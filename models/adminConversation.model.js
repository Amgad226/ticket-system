const mongoose = require('mongoose');

const adminConversationSchema = new mongoose.Schema({

  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Customer",
    required: [true, "Customer id not added"],
  },
  last_message_id: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Message",
    // required: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const AdminConversation = mongoose.model('AdminConversation', adminConversationSchema);

module.exports = AdminConversation;
