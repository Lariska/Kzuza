var express = require('express');
var router = express.Router();
var db = express('mongodb').connect('mongodb://localhost:27017/test');

/*Passport*//*

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//serialize deserialize user
passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user._id);
});
passport.deserializeUser(function (id, done) {
    console.log(id);
    var user = mongoClient.collections('User');
    user.findById(id, done);
});
//Passport Strategy
passport.use(new LocalStrategy(
    function(username, password, done){
        console.log(username, password);
        var user = mongoClient.collections('User');
        user.findOne({username: username}, function(err, user){
            if (err){console.log(err.message); return done(err);}
            if (!user || user.password !== password){
                console.log('not found');
                return done(null, null);
            }
            console.log(user)
            return done(null, user);
        });
    }
));

router.post('/login', passport.authenticate('local', {
    //successRedirect: '/logged_in',
    failureRedirect: '/' },
    function(req,res){
        req.render('logged_in')
    }
));
*/

router.post('/login', function(req, res){
    var db = req.db;
    var collection = db.collection('User');
    var user = collection.findOne(req.username);
    if (user.password == req.password){
        console.log('username: '+user.username+' passowrd: '+user.password+' is loagged in');
        req.render('logged_in', user);
    }else{
        req.render('home')
    }
})


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
