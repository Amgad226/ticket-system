const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// User Schema
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "technician", "manager"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  zipCode: {
    type: String,
    required: false,
  },
  noteAddress: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
