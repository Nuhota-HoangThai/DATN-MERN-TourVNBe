const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: { type: String, required: true },
  body: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  User: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
