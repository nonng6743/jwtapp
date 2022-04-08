const router = require("express").Router();
const verify = require("../routes/verifyToken");
const JWT = require("jsonwebtoken");
const User = require("../model/User");


router.get('/', verify, async(req, res) => {
    const token = req.header("auth-token");
    var decoded = JWT.verify(token, process.env.TOKEN_SECRET);
    const id = decoded._id;
    const user = await User.findById(id).exec();
    res.json({
        post: {
            title: "My First Post",
            description: "Something inside here",
            id: user._id,
            name: user.name,
            email: user.email,
            date: user.date
        }
    })
})


module.exports = router;