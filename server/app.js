const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");

mongoose.connect(process.env.DB_CONNECTION, () => {
  console.log("connected mongo OK");
});

app.use(express.json());
//import the routes
const userRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
app.use("/api/", userRoute);
app.use("/api/posts/", postRoute);

app.listen(5000, () => console.log("server start "));
