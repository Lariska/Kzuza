var express = require('express');
var router = express.Router();
var db = express('mongodb').connect('mongodb://localhost:27017/test');

var israel_cities = require("./israel_cities");
var Order = require('../dbModels/Order');
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
    res.render('home', { title: 'קצוצה' });
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

//TODO: It should be post with passing the meals that user has chosen
router.get('/take_order', function(req, res) {
    var cities = israel_cities.split(",");
    cities.unshift("בחר עיר");
    res.render('take_order', { title: 'Kzuza', user: req.user, cities: cities });
});

router.post('/payment_method', function(req, res) {
    var order = new Order({take_away: req.body.send_choise, status: "in progress",
    city: req.body.city, street: req.body.street, house_number: req.body.house_number,
    apartment_number: req.body.apartment_number, floor: req.body.floor, comments: req.body.comments});
    order.save();
    req.user.orders.push(order);
    req.user.save();
    res.render('payment_method', { title: 'Kzuza', user: req.user, city: order.city,
    street: order.street, house_number: order.house_number, floor: order.floor,
    apartment_number: order.apartment_number, take_away: order.take_away});
});

module.exports = router;