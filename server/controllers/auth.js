const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../Keys");
const cloudinary = require("../utils/cloudinary");

exports.postSignUp = async (req, res, next) => {
  const { name, email, password, media } = req.body;
  if (!email || !password || !name || !media) {
    return res.status(402).json({ error: "Please add all details" });
  }

  const checkUserExist = await User.findOne({ email: email });
  if (checkUserExist) {
    return res
      .status(402)
      .json({ error: "User already exist with that email" });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const mediaRes = await cloudinary.uploader.upload(media);
  const user = new User({
    email: email,
    profile_image: mediaRes.url,
    password: hashedPassword,
    name: name,
  });
  try {
    const newUser = user.save();
    res.json({ message: "Signed up successfully" });
  } catch (err) {
    res.status(402).json({ error: err });
  }
};

exports.postSignIn = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(402).json({ error: "Please add email and passord" });
  }

  let checkUserExist = await User.findOne({ email: email }).populate(
    "requestedBy",
    "_id name profile_image"
  );
  if (!checkUserExist) {
    return res.status(402).json({ error: "User not signed up" });
  }

  const checkPass = await bcrypt.compare(password, checkUserExist.password);
  if (checkPass) {
    const token = jwt.sign({ _id: checkUserExist._id }, JWT_SECRET);
    checkUserExist.password = undefined;
    checkUserExist.requestedTo = undefined;
    checkUserExist.__v = undefined;
    return res.json({
      token,
      message: "Signed in successfully",
      user: checkUserExist,
    });
  } else {
    return res.status(402).json({ error: "Invalid email or password" });
  }
};

exports.requireLogin = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in" });
  }
  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, async (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }

    const { _id } = payload;
    const userdata = await User.findById(_id)
      .populate("requestedBy", "_id name profile_image")
      .populate("requestedTo", "_id name profile_image");

    req.user = userdata;
    next();
  });
};
