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

/* POST to Add User Service */
router.post('/signup', function(req, res) {

    // Set our internal DB variable
    var db = req.db;
    console.log(req.body.username);
    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var Password = req.body.password;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email" : Password
    }, function (err, doc) {
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

module.exports = router;
