const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const userController = require("../controllers/users");
const userRoutes = require("../apiConstants/userApiConstant");

router.get(
  userRoutes.getUserRoute(),
  authController.requireLogin,
  userController.getUserProfile
);

router.put(
  userRoutes.putRequestUserRoute(),
  authController.requireLogin,
  userController.requestUser
);

router.put(
  userRoutes.putRequestAcceptUserRoute(),
  authController.requireLogin,
  userController.requestAcceptUser
);

router.put(
  userRoutes.putRequestDeleteUserRoute(),
  authController.requireLogin,
  userController.requestDeleteUser
);

router.put(
  userRoutes.putUnFollowUserRoute(),
  authController.requireLogin,
  userController.unFollowUser
);

router.post(
  userRoutes.postSearchUserRoute(),
  authController.requireLogin,
  userController.searchUser
);


module.exports = router;
