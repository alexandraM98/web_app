var mysql = require('mysql');

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


function executeQuery (sql, cb) {
  con.query(sql, function(err, result, fields) {
    if (err) throw err;
    cb(result);
  })
}

function fetchData(res) {
  executeQuery("SELECT * FROM user", function(result) {
    console.log(result);
    res.write('<table><tr>');
    for(let column in result[0]) {
      res.write('<td><label>' + column + '</label></td>');
      res.write('</tr>');
    }

    for(let row in result) {
      res.write('<tr>');
      for (let column in result[row]) {
        res.write('<td><label>' + result[row][column] + '</label>,/td>');
      }
      res.write('</tr>');
    }
    res.end('</table>');
  })
}

module.exports = con;