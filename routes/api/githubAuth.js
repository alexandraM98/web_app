const express = require("express");
const passport = require("passport");
const GitHubStrategy = require('passport-github').Strategy;
const router = express.Router();

//require('dotenv').config();

router.use(passport.initialize());

passport.use(new GitHubStrategy({
    clientID: process.env.gitClientID,
    clientSecret: process.env.gitClientSecret,
    callbackURL: "http://" + process.env.HOST + ":3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    /* User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    }); */
    console.log(profile);
    cb(null, profile)
  }
));
module.exports = GitHubStrategy;


module.exports = router;