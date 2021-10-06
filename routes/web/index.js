var express = require("express");

var router = express.Router();

//TO DO: add in error and info

router.use("/", require("./home"));

module.exports = router;