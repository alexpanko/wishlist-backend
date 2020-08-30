const express = require("express");
const passport = require('passport');
const router = express.Router();
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Login route
router.post("/login", (req, res,next) =>{
  passport.authenticate("local", (err, user) => {
    if(err){return next(err)}
    if (!user){return res.status(401).json({error:'user not authenticated'});}
    req.logIn(user, function(err){
      if (err){return next(err);}
      return res.status(200).json(user);
    });
  })(req, res,next)
})

//Signup route
router.post("/signup", (req, res, next) => {
  const {username, password}  = req.body;
  
  if (!username || !password) {
    res.status(401).json({ message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.status(409).json({ message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass
    });

    newUser.save(err => {
      if (err) {
        res.status(400).json({ message: "Saving user to database went wrong."});
        return;
      }
      // Automatically log in user after sign up
      req.login(newUser, (err) => {
        if (err) {
          res.status(500).json({ message: "Login after signup went bad."});
          return;
        }
        // Send the user's information to the frontend
        res.status(200).json(newUser);
      });
    });
  });
});

//Logout route
router.post("/logout", (req, res) => {
  req.logout();
  res.status(200).json({message:'User logged out'});
});

//isLoggedIn route
router.get("/isLoggedIn", (req, res) => {
  // req.isAuthenticated() ? res.status(200).json(req.user) : res.status(403).json({message: "please authenticate"}) 
  if(req.isAuthenticated()) {
    res.status(200).json(req.user)
    return
  }
  res.status(403).json({message: 'please authenticate'})
})

module.exports = router;
