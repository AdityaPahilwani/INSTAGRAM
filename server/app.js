const express = require("express");
const app = express();
const PORT = 5000;

const {
  MONGOURI,
  cloud_name,
  cloud_api_key,
  cloud_api_secret,
} = require("./Keys");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const userRoutes = require("./routes/users");
const bodyParser = require("body-parser");

var path = require("path");

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb" }));

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongoose");
});

mongoose.connection.on("error", (err) => {
  console.log("error in connection by me", err);
});

app.use(authRoutes);
app.use(postRoutes);
app.use(userRoutes);
app.listen(PORT, () => {
  console.log("server onn ");
});
