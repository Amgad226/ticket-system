const mongoose = require("mongoose");
// const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ticketSchema = new mongoose.Schema({
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Customer",
    required: [true, "Customer not added"],
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
  technician: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Technician",
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

///////////////////////////////////////////////// Upload Images ////////////////////////////////////////////
const {upload} =require('../multer')

ticketSchema.pre("save", upload.single("image"), function (next) {
  if (!this.isModified("image") || !this.file) {
    return next();
  }
  this.imagePath = path.join(__dirname, "/Images", this.file.filename);
  next();
});

///////////////////////////////////////////////// Show Images ////////////////////////////////////////////
ticketSchema.statics.showImage = function (res) {
  if (fs.existsSync(this.imagePath)) {
    const stream = fs.createReadStream(this.imagePath);
    stream.pipe(res);
  } else {
    res.send("Image not found!");
  }
};
