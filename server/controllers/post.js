const mongoose = require("mongoose");
const Post = require("../models/post");
const postRoutes = require("../apiConstants/postApiConstant");
const cloudinary = require("../utils/cloudinary");

exports.createPost = async (req, res, next) => {
  const { caption, media } = req.body;

  if (!caption || !media) {
    return res.status(402).json({ error: "Please add all details" });
  }
  req.user.password = undefined;
  try {
    const mediaRes = await cloudinary.uploader.upload(media);
    const post = new Post({
      caption,
      media: mediaRes.url,
      postedBy: req.user,
    });
    const newPost = await post.save();
    return res.json({ message: "New post created", post: newPost });
  } catch (err) {
    console.log(err);
    res.status(402).json({ error: err });
  }
};

const ITEMS_PER_PAGE = 2;

exports.getAllPost = async (req, res, next) => {
  const { _id } = req.user;
  const pageNo = req.params.pageNo;
  let hasMoreData = true;
  try {
    let post = await Post.find()
      .sort("-createdAt")
      .skip((pageNo - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("postedBy", "_id name profile_image")
      .populate("comments.postedBy", "_id name profile_image");

    post = post.map((data, i) => {
      return { ...data._doc, liked: data.likes.includes(_id) };
    });
    if (post.length < ITEMS_PER_PAGE) {
      hasMoreData = false;
    }
    return res.json({
      message: "Success",
      posts: post,
      hasMoreData: hasMoreData,
    });
  } catch (err) {
    // console.log(err);
    res.status(402).json({ error: err });
  }
};

exports.getAllFollowingPost = async (req, res, next) => {
  const { _id, following } = req.user;
  const pageNo = req.params.pageNo;
  let hasMoreData = true;
  try {
    let post = await Post.find({ postedBy: { $in: following } })
      .sort("-createdAt")
      .skip((pageNo - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE)
      .populate("postedBy", "_id name profile_image")
      .populate("comments.postedBy", "_id name profile_image");

    post = post.map((data, i) => {
      return { ...data._doc, liked: data.likes.includes(_id) };
    });
    if (post.length < ITEMS_PER_PAGE) {
      hasMoreData = false;
    }
    return res.json({
      message: "Success",
      posts: post,
      hasMoreData: hasMoreData,
    });
  } catch (err) {
    // console.log(err);
    res.status(402).json({ error: err });
  }
};

exports.getLoggedInUserPosts = async (req, res, next) => {
  const { _id } = req.user;
  try {
    const post = await Post.find({ postedBy: _id })
      .sort("-createdAt")
      .populate("postedBy", "_id name profile_image")
      .populate("comments.postedBy", "_id name profile_image");
    return res.json({ message: "Success", posts: post });
  } catch (err) {
    res.status(402).json({ error: err });
  }
};

exports.likePost = async (req, res, next) => {
  const { postId } = req.body;
  const { _id } = req.user;

  Post.findByIdAndUpdate(
    postId,
    {
      $push: { likes: _id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(402).json({ error: err });
    } else {
      return res.json({ message: "Liked", result });
    }
  });
};

exports.unLikePost = async (req, res, next) => {
  const { postId } = req.body;
  const { _id } = req.user;
  Post.findByIdAndUpdate(
    postId,
    {
      $pull: { likes: _id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(402).json({ error: err });
    } else {
      return res.json({ message: "unLiked", result });
    }
  });
};

exports.commentOnPost = async (req, res, next) => {
  const { comment, postId } = req.body;
  const { _id } = req.user;
  const commentObj = {
    comment,
    postedBy: _id,
  };
  Post.findByIdAndUpdate(
    postId,
    {
      $push: { comments: commentObj },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(402).json({ error: err });
    } else {
      return res.json({ message: "Liked", result });
    }
  });
};

exports.getCommentsForPost = async (req, res, next) => {
  const { postId } = req.params;
  const { _id } = req.user;
  try {
    const postComments = await Post.findOne({ _id: postId }).populate(
      "comments.postedBy",
      "_id name profile_image"
    );
    return res.json({ message: "successfully delete", postComments });
  } catch (err) {
    return res.status(402).json({ error: err });
  }
};

exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  const { _id } = req.user;
  try {
    const checkIfPostExist = await Post.findOne({ _id: postId });
    if (checkIfPostExist.postedBy._id.toString() === _id.toString()) {
      const result = await checkIfPostExist.remove();
      return res.json({ message: "successfully delete" });
    }
  } catch (err) {
    return res.status(402).json({ error: err });
  }
};
