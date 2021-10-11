/* All variables needed for main app */
const express = require("express");
const path = require("path");
const session = require('express-session');
const passport = require("passport");
const cookieParser = require("cookie-parser");
const app = express();
const mysql = require('mysql');

/* Require dotenv */
//require('dotenv').config();


/* Setting the app port */
app.set("port", process.env.port || 3000);
app.listen(app.get("port"),function(){
  console.log("Server started on port " + app.get("port"));

});

/* Setting the app views */
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); //ejs is a JavaScript templating engine and stands for Effective JavaScript

/* Using the route files from the web and api folders under routes */
//var routes = require("./routes");
app.use("/", require("./routes/web"));
app.use("/api", require("./routes/api"));

/* Setting the user routes */
const userRoutes = require("./routes/api/users");
app.use("/users", userRoutes);

/* Importing the git authentication from routes folder */
const gitAuth = require("./routes/api/githubAuth");
app.use("/githubAuth", gitAuth); 

/* Importing the twitter authentication from routes folder */
const twitterAuth = require("./routes/api/twitterAuth");
app.use("/twitterAuth", twitterAuth); 


/* Setting up the MySQL connection from separate js file 
const mysqlconn = require("./connection");
*/

/* Setting up a MySQL connection 

var con = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
*/

app.use(express.json());
app.use(cookieParser()); //used to store our user tokens for the session and also to determine whether they can access certain routes

/* Initialising a session using passport*/
app.use(
  session({
      secret: 'cat',
      resave: false,
      saveUninitialized: false,
      cookie: {
          httpOnly: true, //this cookie is going to be stored only in the server, not in the browser
          secure: false, //because I am using http and not https
          maxAge: 24 * 60 * 60 * 1000,
      },
  })
);

app.use(passport.initialize());
app.use(passport.session());


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


/**GitHub Auth starts here....
*/
app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect to physician view.
    res.redirect('/physician');
  });


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

  app.get('/patientList', isAuth, (req, res)=>{
    //fetchData(res);
  });

/**GitHub Auth ends here....
*/


/**Twitter Auth starts here....
*/
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

/* Serialising and deserialising the user */
passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  cb(null, id);
});
 



function executeQuery (sql, cb) {
  con.query(sql, function(err, result, fields) {
    if (err) throw err;
    cb(result);
  })
}

function fetchData(res) {
  executeQuery("SELECT * FROM user", function(result) {
    res.write('<table><tr>');
    for(let column in result[0]) {
      res.write('<th><label>' + column + '</label></th>');
    }

    res.write('</tr>');
    for(let row in result) {
      res.write('<tr>');
      for (let column in result[row]) {
        res.write('<td><label>' + result[row][column] + '</label></td>');
      }
      res.write('</tr>');
    }

    res.end('</table>');
  })
}
