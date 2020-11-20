const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Post = require("../models/post");

exports.getUserProfile = async (req, res, next) => {
  const { userId } = req.params;
  const { _id, following, requestedBy, requestedTo } = req.user;
  let totalPost, totalFollowers, totalFollowing;
  let post = [];
  if (mongoose.Types.ObjectId.isValid(userId)) {
    try {
      const checkUserExist = await User.findOne({ _id: userId })
        .select("-password -requestedTo -requestedBy")
        .populate("followers", "_id name profile_image")
        .populate("following", "_id name profile_image");
      totalFollowers = checkUserExist.followers.length;
      totalFollowing = checkUserExist.following.length;

      function checkArr(data) {
        return data._id.toString() === userId.toString();
      }
      const adminRequestedUser = requestedTo.some(checkArr);
      const userRequestedAdmin = requestedBy.some(checkArr);

      const doesAdminFollow = following.includes(userId);
      const isAdmin = _id.toString() === checkUserExist._id.toString();
      if (checkUserExist) {
        post = await Post.find({ postedBy: userId })
          .sort("-createdAt")
          .populate("postedBy", "_id name profile_image")
          .populate("comments.postedBy", "_id name profile_image");
        post = post.map((data, i) => {
          return { ...data._doc, liked: data.likes.includes(_id) };
        });
        totalPost = post.length;

        if (!doesAdminFollow && !isAdmin) {
          post = [];
          checkUserExist.followers = [];
          checkUserExist.following = [];
        }

        return res.json({
          message: "User found",
          user: checkUserExist,
          userPosts: post,
          isAdmin: isAdmin,
          doesAdminFollow: doesAdminFollow,
          adminRequestedUser: adminRequestedUser,
          userRequestedAdmin: userRequestedAdmin,
          totalFollowers: totalFollowers,
          totalFollowing: totalFollowing,
          totalPost: totalPost,
        });
      } else {
        return res.status(402).json({ error: "User doesn't exist" });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    return res.status(402).json({ error: "User doesn't exist" });
  }
};

exports.requestUser = async (req, res, next) => {
  const { userId } = req.body;
  const { _id } = req.user;
  try {
    await User.findByIdAndUpdate(
      _id,
      {
        $push: { requestedTo: userId },
      },
      {
        new: true,
      }
    );
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { requestedBy: _id },
      },
      {
        new: true,
      }
    );
    return res.json({
      message: "Request sent",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.requestAcceptUser = async (req, res, next) => {
  const { userId } = req.body;
  const { _id } = req.user;
  try {
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { following: _id },
        $pull: { requestedTo: _id },
      },
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      _id,
      {
        $push: { followers: userId },
        $pull: { requestedBy: userId },
      },
      {
        new: true,
      }
    );

    return res.json({
      message: "Request accepted",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.requestDeleteUser = async (req, res, next) => {
  const { userId } = req.body;
  const { _id } = req.user;
  try {
    await User.findByIdAndUpdate(
      _id,
      {
        $pull: { requestedTo: userId },
      },
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { requestedBy: _id },
      },
      {
        new: true,
      }
    );
    return res.json({
      message: "Request deleted",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.unFollowUser = async (req, res, next) => {
  const { userId } = req.body;
  const { _id } = req.user;
  try {
    await User.findByIdAndUpdate(
      _id,
      {
        $pull: { following: userId },
      },
      {
        new: true,
      }
    );

    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { followers: _id },
      },
      {
        new: true,
      }
    );
    return res.json({
      message: "Unfollowed",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.searchUser = async (req, res, next) => {
  const { name } = req.body;
  if (name === "" || !name) {
    return res.json({ message: "search complete", searchResult: [] });
  }
  let pattern = new RegExp("^" + name);
  try {
    const searchResult = await User.find({
      name: { $regex: pattern, $options: "i" },
    }).select("profile_image _id name");
    return res.json({ message: "search complete", searchResult: searchResult });
  } catch (err) {
    return res.status(402).json({ error: err });
  }
};
