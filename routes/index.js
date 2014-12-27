var express = require('express');
var router = express.Router();


/* GET New User page. */
router.get('/', function(req, res) {
    res.render('home', { title: 'Kzuza' });
});

/* GET logged_in page. */
router.get('/logged_in', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('logged_in', {
            "logged_in" : docs
        });
    });
});

/* GET New sign up. */
router.get('/signup', function(req, res) {
    res.render('signup', { title: 'Kzuza' });
});

/* GET New forget password. */
router.get('/forget_password', function(req, res) {
    res.render('forget_password', { title: 'Kzuza' });
});


/* POST to Add User Service */
router.post('/signup', function(req, res) {
    var users = req.db.get('User');

    // Submit to the DB
    user.insert({
        "username" : req.body.username,
        "password" : req.body.password,
        "phone_number" : req.body.phone_number
    },

        function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("logged_in");
            // And forward to success page
            res.redirect("logged_in");
        }
    });
});


/* POST to forget_password */
router.post('/forget_password', function(req, res) {
    var users = req.db.get('User');
    // Submit to the DB
    user.insert({
            "username": req.body.username,
            "email": req.body.email
    });
});

module.exports = router;
