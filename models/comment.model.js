const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Comment is required"],
    minlength: [3, "Minimum comment length is 3 characters"],
  },
  creationDate: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  customer: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Customer",
    required: [true, "Customer not added"],
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
