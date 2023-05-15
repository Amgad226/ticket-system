const mongoose = require("mongoose");
// const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ticketSchema = new mongoose.Schema({
  //user_id
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Customer",
    required: [true, "Customer not added"],
  },
  //user_id for manager
  manager: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Customer",
  },
  //user_id for technician
  technician: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Technician",
  },
  creationDate: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  imagePath:{
    type: String
  },
  description: {
    type: String,
    required: [true, "Description not added"],
  },
  priority: {
    type: String,
    enum: ["Minor", "Normal", "Critical"],
    default: "Normal",
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Closed", "Rejected", "Resolved"],
    default: "Open",
  },
  comments: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Comment",
    },
  ],
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;

