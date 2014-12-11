var express = require('express');
//var validator = require('express-validator');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//var db = require(); // add data base later



// Configure passport
passport.use(new LocalStrategy(
    function(username, password, done){
        if(username=='admin' && password=='admin'){
            return done(null, {username: 'admin'});
        }else {
            return done(null, false);
        }
    }
));
//
//router.post('/login', passport.authenticate('local', {
//    successRedirect: '/logged_in',
//    failureRedirect: '/home',
//    failureFlash: true
//}));

//serialize
passport.serializeUser(function(user, done) {
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    done(null, {username: id});
    //User.findById(id, function(err, user) {
      //  done(err, user);
   // });
});



module.exports = passport;
