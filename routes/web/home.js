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

router.get('/patientProfile', function(req, res) {
    res.render("home/patientProfile");
});


module.exports = router;

