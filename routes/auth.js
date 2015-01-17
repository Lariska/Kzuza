var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportLocal = require('passport-local');
var mongoose = require('mongoose');
var db = mongoose.db;
var User = require('../dbModels/User');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('Yud7ibdLRCJrr1OH9jNuGA');

passport.use(new passportLocal.Strategy(
    function (username, password, done){
        console.log(username, password);
        User.findOne({username: username}, function(err, user){
            if (err) return done(err);
            if (!user || user.password !== password){
                return done(null, null);
            }
            return done(null, user);
        });
    }
));

passport.use('signup', new passportLocal.Strategy({passReqToCallback : true},
    function(req, username, password, done) {
        findOrCreateUser = function(){
            // find a user in Mongo with provided username
            User.findOne({'username':username},function(err, user) {
                // In case of any error return
                if (err){
                    console.log('Error in SignUp: '+err);
                    return done(err);
                }
                // already exists
                if (user) {
                    console.log('User already exists');
                    return done("User already exists");
                } else {
                    // if there is no user with that email
                    // create the user
                    var newUser = new User({email : req.param('email'), username : username, password : password});

                    // save the user
                    newUser.save(function(err) {
                        if (err){
                            console.log('Error in Saving user: '+err);
                            throw err;
                        }
                        console.log('User Registration succesful');
                        return done(null, newUser);
                    });
                }
            });
        };
        // Delay the execution of findOrCreateUser and execute
        // the method in the next tick of the event loop
        process.nextTick(findOrCreateUser);
    }
));


//serialize
passport.serializeUser(function(user, done) {
    done(null, user._id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, done);
});

router.get('/login', function(req, res) {
    res.render('auth/login', { title: 'Please login.' });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/daily_meal',
    failureRedirect: '/'
}));


router.get('/signup', function(req, res) {
    res.render('signup', { title: 'Kzuza' });
});


//router.post('/signup', function(req, res){
//    console.log('start');
//    var email = req.param('email');
//    var username = req.param('username');
//    var password = req.param('password');
//    var confirmPassword = req.param('confirmPassword');
//    var errors = {};
//
//    if (password !== confirmPassword) {
//        errors.confirmPassword = {
//            message: 'Passwords do not match.'
//        };
//    }
//    console.log(errors);
//    if (Object.keys(errors).length > 0) {
//        res.render('auth/signup', {
//            titel: 'Sign Up',
//            errors: errors
//        });
//    }
//
//    var newUser = new user({
//        email : email,
//        username : username,
//        password : password
//    });
//
//    newUser.save(function(err, user){
//        if (err){
//            console.error(err.message);
//        } else {
//            passport.authenticate('signup', {
//                successRedirect: '/daily_meal',
//                failureRedirect: '/'
//            })
//            //res.redirect('/daily_meal');
//        }
//    });
//});

router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/daily_meal',
    failureRedirect: '/',
    failureFlash : true
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/auth/login');
});

router.get('/forget_password', function(req, res) {
    res.render('forget_password', { title: 'Kzuza' });
});

router.post('/forget_password', function(req, res) {
    User.findOne({'username':req.body.username},function(err, user) {
        var message = {
            "html": "<p dir='rtl'>" + " הסיסמא שלך לאתר קצוצה: " + user.password + "</p>",
            "subject": "קצוצה בר סלטים",
            "from_email": "kzuza@example.com",
            "to": [{ "email": req.body.mail}]
        };
        mandrill_client.messages.send({"message": message}, function(result) {
            res.redirect('/');
        });
    });
});


module.exports = router;