var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

//TODO: configure passport authentication
//var passport = require('passport');
//var LocalStrategy = require('passport-local').Strategy;

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var MongoClient = mongo.MongoClient;

//switch between the url
//var dbUrl = 'mongodb://oz:oz1234@ds030817.mongolab.com:30817/kzuza';
var dbUrl = 'localhost:27017/test'
var db = monk(dbUrl);
MongoClient.connect('mongodb://'+dbUrl, function(err, dbTest){
    if(err || !dbTest){
        console.log("not connected "+err.message);
    }else{
        console.log('Data base connected to '+ dbUrl );
        db = dbTest;
    }
});

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/static/images/icon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use("/static", express.static(path.join(__dirname, 'static')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});


//passport.use(new LocalStrategy(
//    function(username, password, done) {
//        User.findOne({ username: username }, function(err, user) {
//            if (err) { return done(err); }
//            if (!user) {
//                return done(null, false, { message: 'Incorrect username.' });
//            }
//            if (!user.validPassword(password)) {
//                return done(null, false, { message: 'Incorrect password.' });
//            }
//            return done(null, user);
//        });
//    }
//));
//
//app.get('/login', function(req, res, next) {
//    passport.authenticate('local', function(err, user, info) {
//        if (err) { return next(err); }
//        if (!user) { return res.redirect('/login'); }
//        req.logIn(user, function(err) {
//            if (err) { return next(err); }
//            return res.redirect('/users/' + user.username);
//        });
//    })(req, res, next);
//});
//
//app.post('/signup', passport.authenticate('local', { successRedirect: '/logged_in',
//    failureRedirect: '/' }));

app.use('/', routes);
app.use('/users', users);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;