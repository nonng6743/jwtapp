const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const { registerValidation ,loginValidation} = require("../validation");
const JWT = require("jsonwebtoken");
const { json } = require("express");

router.get("/", (req, res) => {
  res.send("home api");
});

//register
router.post("/users/register", async (req, res) => {
  //Lets validate the user data
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // checking the user email already exist or not
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.status(200).send({ user: savedUser });
  } catch (err) {
    res.status(400).send({ status: "Failed", msg: err });
  }
});

//login
router.post("/users/login", async (req, res) => {
    //lets validata the user data
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({
      "status": "error",
      "message" : error.details[0].message});

    // checking the user email 
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({
      "status" : "error",
      "message" : "Invalid Email"
    });

    // checking the password
    const vaildPass = await bcrypt.compare(req.body.password, user.password);
    if (!vaildPass) return res.status(400).json({
      "status" : "error",
      "message" : "Invalid Password"
    });
    // creating a token for the user
    const token = JWT.sign({_id : user._id}, process.env.TOKEN_SECRET);
    res.header("auth-token", token);
    res.json({
      "status": "ok",
      "message": "Logged in",
      "accessToken": token,
      "user": user        
  });

});

module.exports = router;
