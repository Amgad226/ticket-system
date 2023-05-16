const express = require("express");
const router = express.Router();
// const Comment = require("../models/comment.model");
// const { getComment, verifyToken } = require("../utils/utils");
// const Ticket = require("../models/ticket.model");

// // Get all comments
// router.get("/tickets/:id", verifyToken, async (req, res) => {
//   try {
//     const comments = await Comment.find();
//     res.json(comments);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get a specific comment
// router.get("/tickets/:idTicket/:id", verifyToken, getComment, (req, res) => {
//   res.json(res.comment);
// });

// // Create a new comment
// router.post("/", verifyToken, async (req, res) => {
//   const idTicket = req.body.idTicket;
//   let ticket = await Ticket.findById(idTicket);
//   if (!ticket) {
//     return res.status(404).json({ message: "Ticket not found" });
//   }
//   const comment = new Comment({
//     content: req.body.content,
//     customer: req.body.customer,
//   });

//   try {
//     const newComment = await comment.save();
//     ticket = ticket.comments.push(newComment);
//     await ticket.save();
//     res.status(201).json(newComment);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Update a comment
// router.patch("/:id", verifyToken, getComment, async (req, res) => {
//   if (req.body.content != null) {
//     res.comment.content = req.body.content;
//   }

//   try {
//     const updatedComment = await res.comment.save();
//     res.json(updatedComment);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // Delete a comment
// router.delete("/:id", verifyToken, getComment, async (req, res) => {
//   try {
//     await res.comment.remove();
//     res.json({ message: "Comment deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

module.exports = router;
