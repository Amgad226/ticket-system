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
  participants: {
    type: [Object], // Specify the field as an array
    // required: true
  },

}
, { toJSON: { virtuals: true } });

managerConversationSchema.virtual('last_message', {
  ref: 'ManagerMessage',
  localField: 'last_message_id',
  foreignField: '_id',
  justOne: true,
  options: { select: 'body' }
});

const ManagerConversation = mongoose.model('ManagerConversation', managerConversationSchema);

module.exports = ManagerConversation;
