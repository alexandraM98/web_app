var express = require("express");
//Path is a library that will enable me to search for paths, basic directories, etc (folder paths)
var path = require("path");


var cookieParser = require("cookie-parser");
var app = express();
app.set("port", process.env.port || 3000);

//Is this working?


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs"); //ejs is a JavaScript templating engine and stands for Effective JavaScript



//var routes = require("./routes");
app.use("/", require("./routes/web"));
app.use("/api", require("./routes/api"));

app.use(express.json());
app.use(cookieParser()); //used to store our user tokens for the session and also to determine whether they can access certain routes



app.listen(app.get("port"),function(){
    console.log("Server started on port " + app.get("port"));

});


/**Google Auth starts here....
*/
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '1079048489559-kmjhtba8ucpjpppoh3r187339egijl2o.apps.googleusercontent.com';
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


/* router.post('/signup', function(req,res) {
    request.body.name
}); */


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

app.get('/physician', (req, res)=>{
    let user = req.user;
    res.render('home/physician', {user});
});



