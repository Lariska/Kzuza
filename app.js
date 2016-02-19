var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var mongoose = require('mongoose');

//TODO: Need to fix
var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var data = require('./routes/dataResource');

//Database connection
//var uristring = 'mongodb://oz:q123456@ds030817.mongolab.com:30817/kzuza';
var uristring = 'mongodb://lora:lora@ds030817.mongolab.com:30817/kzuza';
//var uristring = 'mongodb://localhost:27017/kzuza';
var db = mongoose.connect(uristring, function (err, res){
    if (err) {
        console.log ('ERROR connecting to: ' + uristring + '.'+err);
    } else {
        console.log ('Succeeded connected to: ' + uristring);
    }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/static/images/favicon.png'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use("/", express.static(path.join(__dirname, 'static')));

//TODO: Need to fix
app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/data', data);

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