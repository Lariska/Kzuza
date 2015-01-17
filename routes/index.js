var express = require('express');
var router = express.Router();
var db = express('mongodb').connect('mongodb://localhost:27017/test');

//router.post('/login', function(req, res){
//    var db = req.db;
//    var collection = db.collection('User');
//    var user = collection.findOne(req.username);
//    if (user.password == req.password){
//        console.log('username: '+user.username+' passowrd: '+user.password+' is loagged in');
//        req.render('logged_in', user);
//    }else{
//        req.render('home')
//    }
//})


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
//router.get('/signup', function(req, res) {
//    res.render('signup', { title: 'Kzuza' });
//});

/* POST to Add User Service */
router.post('/signup', function(req, res) {
    var db = req.db;//.get('User');

    // Submit to the DB
    db.collection('User').insert({
        "username" : req.body.username,
        "password" : req.body.password,
        "phone_number" : req.body.phone_number
    },
        function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
            console.log("There was a problem adding the information to the database.")
        }
        else {
            console.log( req.body.username+' '+req.body.password+' added to Data base')
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("logged_in");
            // And forward to success page
            res.redirect('/');
        }
    });
});

router.get('/daily_meal', function(req, res) {
    res.render('daily_meal', { title: 'Kzuza', user: req.user });
});

module.exports = router;
