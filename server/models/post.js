const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      required: true,
    },
    media: {
      type: Object,
      required: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        comment: String,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
