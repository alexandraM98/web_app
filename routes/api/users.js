var express = require("express");
//const mysqlconn = require("../../connection");

var router = express.Router();

router.get('/', function(req, res) {
    mysqlconn.query("SELECT * FROM user", (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        }
        else {
            console.log(err);
        }
    })
});

module.exports = router;