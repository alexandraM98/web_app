var express = require("express");
//Path is a library that will enable me to search for paths, basic directories, etc (folder paths)
var path = require("path");
var session = require('express-session');
require('dotenv').config();


var cookieParser = require("cookie-parser");
var app = express();
app.set("port", process.env.port || 3000);

//Is this working? I wonder?

const passport = require("passport");


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); //ejs is a JavaScript templating engine and stands for Effective JavaScript



//var routes = require("./routes");
app.use("/", require("./routes/web"));
app.use("/api", require("./routes/api"));

app.use(express.json());
app.use(cookieParser()); //used to store our user tokens for the session and also to determine whether they can access certain routes

app.use(
    session({
        secret: 'cat',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true, //this cookie is going to be stored only in the server, not in the browser
            secure: false, //because we are using http
            maxAge: 24 * 60 * 60 * 1000,
        },
    })
);

app.listen(app.get("port"),function(){
    console.log("Server started on port " + app.get("port"));

});


/**Google Auth starts here....
*/
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = process.env.googleClientID;
const client = new OAuth2Client(CLIENT_ID);

function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/login')
      })

};


app.post('/login', (req,res)=>{
    let token = req.body['token'];

    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
      }
      verify()
      .then(()=>{
          res.cookie('session-token', token);
          res.send('success')
      })
      .catch(console.error);

});

app.get('/patient', checkAuthenticated, (req, res)=>{
    let user = req.user;
    res.render('home/patient', {user});
});

/**Google Auth ends here....
*/


app.get('/logout', (req, res) => {
    res.clearCookie('session-token');
    req.session.destroy();
    res.redirect('/login');
});

app.get('/protectedRoute', checkAuthenticated, function(req, res) {
    res.render("home/protectedRoute");
});
//Now we need some basic routing for our application. So far all it does is listening for 
//when the app gets the port and printing out a message when it listens.

//There are many ways in which to do routing in JS. A better practice is to do the routing in a 
//separate file from app.js. That will be routes.js. This will be used for routing.


/**GitHub Auth starts here....
*/

//In order for this to work, we need to serialise the user profile information into the session 

app.use(passport.initialize());
app.use(passport.session());


const GitHubStrategy = require('passport-github').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.gitClientID,
    clientSecret: process.env.gitClientSecret,
    callbackURL: process.env.gitCallback
  },
  function(accessToken, refreshToken, profile, cb) {
    /* User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(err, user);
    }); */
    console.log(profile);
    cb(null, profile)
  }
));

app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to physician view.
    res.redirect('/physician');
  });

  //What I still need to figure out is how to clear cookies so that I can log out properly.
/**GitHub Auth ends here....
*/

const isAuth = (req, res, next) => {
    if (req.user) {
        next();
    }
    else {
        res.redirect("/login");
    }
};

 app.get('/physician', isAuth, (req, res)=>{
    res.render('home/physician');
});


/**Twitter Auth starts here....
*/

//import { twitterClientID, twitterClientSecret, twitterAccessToken, twitterTokenSecret } from "../SWA/security.js";

const apiKey = process.env.twitterClientID;
const apiSecretKey = process.env.twitterClientSecret;
const accessToken = process.env.twitterAccessToken;
const tokenSecret = process.env.twitterTokenSecret;

const TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: apiKey,
    consumerSecret: apiSecretKey,
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
    /* User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb(err, user);
    }); */
    console.log(profile);
    cb(null, profile);
  }
));

app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/researcher');
  });


  app.get('/researcher', isAuth, (req, res)=>{
    res.render('home/researcher');
});

/**Twitter Auth ends here....
*/
 

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
    cb(null, id);
});