const apiKey = process.env.twitterClientID;
const apiSecretKey = process.env.twitterClientSecret;
const accessToken = process.env.twitterAccessToken;
const tokenSecret = process.env.twitterTokenSecret;

const express = require("express");
const passport = require("passport");
const TwitterStrategy = require('passport-twitter').Strategy;
const router = express.Router();

//require('dotenv').config();

router.use(passport.initialize());

passport.use(new TwitterStrategy({
    consumerKey: apiKey,
    consumerSecret: apiSecretKey,
    callbackURL: "http://" + process.env.HOST + ":" + process.env.PORT + "auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
    /* User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    }); */
    cb(null, profile);
  }
));


module.exports = TwitterStrategy;


module.exports = router;