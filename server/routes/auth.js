const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const authRoutes = require("../apiConstants/authApiConstant");

router.get("/", (req, res) => {
  res.send("Hello");
});

router.post(authRoutes.postSignUpRoute(), authController.postSignUp);

router.post(authRoutes.postSignInRoute(), authController.postSignIn);


module.exports = router;
