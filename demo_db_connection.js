var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "default",
  database: "default"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });
