var express = require('express');
var router = express.Router();
var passport = require('passport');
var passportLocal = require('passport-local');
var GoogleStrategy = require('passport-google').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
// delete this -->> var db = mongoose.db;
var User = require('../dbModels/User');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('Yud7ibdLRCJrr1OH9jNuGA');

function find_or_create_user(find_params, create_params, done) {
    User.findOne(find_params,function(err, user) {
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
            var newUser = new User(create_params);

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
}

//TODO: forgot password should be disabled both for google and facebook
//TODO: reenter password should be disabled when finishing order if the user
//TODO: came from google or facebook
passport.use(new GoogleStrategy({
        returnURL: 'http://localhost:3000/auth/google/return',
        realm: 'http://localhost:3000/'
    },
    function(identifier, profile, done) {
        console.log(profile);
        find_or_create_user({ openId: identifier }, {email : profile["emails"][0]["value"],
                username : profile["name"]["givenName"], password : profile["emails"][0]["value"]}, done);
    }
));

passport.use(new FacebookStrategy({
        clientID: "347426272128710",
        clientSecret: "5724678ef4b5797b0c3f611d356aa1fb",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
        find_or_create_user({ facebookId: profile["id"] }, {
            username : profile["name"]["givenName"], password : profile["id"]}, done);
    }
));

passport.use(new passportLocal.Strategy(
    function (username, password, done){
        console.log(username, password);
        User.findOne({username: username}, function(err, user){
            if (err){
                console.log('Error finding user: ' + err.message);
                return done(err);
            }
            if (!user || user.password !== password){
                console.log('username or password incorrect');
                return done(null, null);
            }
            return done(null, user);
        });
    }
));

passport.use('signup', new passportLocal.Strategy({passReqToCallback : true},
    function(req, username, password, done) {
        findOrCreateUser = function(){
            find_or_create_user({'username':username}, {email : req.param('email'),
                username : username, password : password}, done);
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
    res.render('loginPage', { title: 'Please login.' });
});

router.post('/login', passport.authenticate('local', {
    successRedirect: '/daily_meal',
    failureRedirect: '/auth/login'
}));


router.get('/signUp', function(req, res) {
    res.render('singUpPage', { title: 'Kzuza' });
});

router.post('/signUp', passport.authenticate('signup', {
    successRedirect: '/daily_meal',
    failureRedirect: '/auth/singUp',
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

// Redirect the user to Google for authentication.  When complete, Google
// will redirect the user back to the application at
//     /auth/google/return
router.get('/google', passport.authenticate('google'));

// Google will redirect the user to this URL after authentication.  Finish
// the process by verifying the assertion.  If valid, the user will be
// logged in.  Otherwise, authentication has failed.
router.get('/google/return',
    passport.authenticate('google', { successRedirect: '/daily_meal',
        failureRedirect: '/' }));

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/daily_meal',
        failureRedirect: '/' }));

module.exports = router;