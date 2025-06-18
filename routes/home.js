const express = require("express");
const router = express.Router();
const authenticate = require('../middlewares/sessionCheck')
loginState = false
router.get("/",(req,res)=>{res.render("index",{
    loginState
})})
router.get("/profile",authenticate, (req, res) => {
    let user = req.user.name 
    console.log(user);
  res.render('profile',{user})
});

module.exports = router