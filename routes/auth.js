const express = require("express");
const csrfProtection = require('../utils/csrf')
const router = express.Router();
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const FamilyGroup = require('../models/FamilyGroup')
const { body, validationResult } = require('express-validator');
const authenticate = require("../middlewares/sessionCheck");
require("dotenv").config()
router.get(
  "/register",
  csrfProtection,
  (req,res)=>{
    res.render(
      "register",
      {csrfToken: req.csrfToken(),
        error:false,
        errorMessage:false
      }
    )
  }
)
router.get(
  "/logout",
  (req, res) => {
    res.cookie("token","")
    res.render("login")
  }
);
router.post("/delete/:id", authenticate, async (req, res) => {
  if (req.user.id === req.params.id) {
    try {
      const deletedUser = await userModel.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.send("User not found.");
      }
      res.send(`<h1>User Deleted</h1><br>${JSON.stringify(deletedUser)}`);
    } catch (error) {
      console.error("Delete Error:", error);
      res.status(500).send("An error occurred while deleting the user.");
    }
  } else {
    res.status(403).send("You are not authorized to delete this user.");
  }
});

router.get(
  "/login",
  csrfProtection,
  (req, res) => {
    res.render(
      "login",
      {csrfToken:req.csrfToken(),
        error: false,
        errorMessage: null
      }
    )
  }
);

router.post(
  '/register',
  csrfProtection,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ],
  async (req, res) => {
    const { name, email, password } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('register', {
        csrfToken: req.csrfToken(),
        error: true,
        errorMessage: errors.array()[0].msg,
      });
    }

    try {
      const existingUser = await userModel.findOne({ email }).lean();
      console.log(existingUser);
      if (existingUser) {
        return res.render('register', {
          csrfToken: req.csrfToken(),
          error: true,
          errorMessage: 'Email already exists!',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = jwt.sign(
        { id: newUser._id,email:email},
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, 
      });

      res.redirect('/profile'); // safer than rendering directly
    } catch (error) {
      console.error('[Register Error]:', error.message);
      res.render('register', {
        csrfToken: req.csrfToken(),
        error: true,
        errorMessage: 'An internal server error occurred. Please try again later.',
      });
    }
  }
);
router.post("/login",csrfProtection,[body('email').isEmail().normalizeEmail().withMessage('Valid email is required')], async (req,res)=>{
  let {email,password} = req.body
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('login', {
        csrfToken: req.csrfToken(),
        error: true,
        errorMessage: errors.array()[0].msg,
      });
    }
    
    try {
      const user = await userModel.findOne({email}).lean()
      if (!user) {
        return res.render('login', {
          csrfToken: req.csrfToken(),
          error: true,
          errorMessage: 'Something went wrong!',
        });
      }
      
      const isMatch = await bcrypt.compare(password,user.password)
      if (!isMatch) {
        return res.render('login', {
          csrfToken: req.csrfToken(),
          error: true,
          errorMessage: 'Something went wrong!',
        });
      }
      
      const token = jwt.sign(
        { email: user.email, userid: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.redirect("/profile")
    } catch (error) {
      console.error('[Register Error]:', error);
      res.render('login', {
        csrfToken: req.csrfToken(),
        error: true,
        errorMessage: 'An internal server error occurred. Please try again later.',
      });
    }
})
module.exports = router