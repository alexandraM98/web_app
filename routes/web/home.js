var express = require('express');

var router = express.Router();



router.get('/', function(req, res){
    res.render("home/index");
});


router.get('/login', function(req, res) {
    res.render("home/login");
});

router.get('/videos', function(req, res) {
    res.render("home/videos");
});


module.exports = router;

