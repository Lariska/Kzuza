var express = require('express');
var router = express.Router();
var db = express('mongodb').connect('mongodb://localhost:27017/test');

var israel_cities = require("./israel_cities");
var Order = require('../dbModels/Order').Order;
var Credit = require('../dbModels/Credit');
var userOrder = require('../dbModels/Order').userOrder;
var Salad = require('../dbModels/Salad').salad;

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
    //console.log(req.cookies);
    res.render('HomeNew', { title: 'קצוצה' });
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

router.get('/home', function(req, res) {
    res.render('home', { title: 'Kzuza', user: req.user });
});

//TODO: It should be post with passing the meals that user has chosen
router.get('/take_order', function(req, res) {
    var cities = israel_cities.split(",");
    cities.unshift("בחר עיר");
    var price =  req.cookies.cart ? req.cookies.cart.price : 0;
    if(typeof price === 'undefined'){
        price = 0;
    };
    res.render('take_order', { title: 'Kzuza', user: req.user, cities: cities , price: price});
});


router.post('/payment_method', function(req, res) {
    var order = new Order({take_away: req.body.send_choise, status: "in progress", user: req.user,
    city: req.body.city, street: req.body.street, house_number: req.body.house_number,
    apartment_number: req.body.apartment_number, floor: req.body.floor, comments: req.body.comments});
    order.save();
    req.user.orders.push(order);
    req.user.save();
    res.render('payment_method', { title: 'Kzuza', user: req.user, city: order.city,
    street: order.street, house_number: order.house_number, floor: order.floor,
    apartment_number: order.apartment_number, take_away: order.take_away});
});

router.post('/payment', function(req, res) {
    console.log(req.body.is_cash);
    if (req.body.is_cash == "true") {
        res.render('cash', { title: 'Kzuza', user: req.user });
    }
    else {
        res.render('credit', { title: 'Kzuza', user: req.user });
    }
});

router.post('/success', function(req, res) {
    if ("card_number" in req.body) {
        var credit = new Credit({user: req.user, card_number: req.body.card_number,
        month: req.body.month, year: req.body.year, id: req.body.id,
        name: req.body.name, secret_number: req.body.secret_number});
        credit.save();
        order_id = req.user.orders[req.user.orders.length-1];
        console.log(req.user.orders);
        console.log(order_id);
        Order.findOne({ '_id': order_id }, 'credit_card', function (err, order) {
            order.credit_card = credit;
            order.save();
        })
    }
    res.render('success', { title: 'Kzuza', user: req.user });
});

router.get('/menu', function(req, res){
    res.render('menuPage', {title: "תפריט", user: req.user });
});

router.get('/sandwich', function(req, res){
    res.render('sandwichPage', {title: "סנדוויצ'ים", user: req.user});
});

router.get('/salad/:size?', function(req, res){
    var size = req.param('size');
    if (size) {
        res.render('saladPage', {title: "סלטים", user: req.user, size: size});
    } else{
        res.render('saladPage', {title: "סלטים", user: req.user});
    }
});

router.get('/contact', function(req, res){
    res.render('contactPage', {title: "צור קשר", user: req.user});
});

router.get('/recommendations', function(req, res){
    res.render('recommendationsPage', {title: "המלצות", user: req.user});
});

router.post('/order/item/:id?', function(req, res){
    //res.clearCookie('cart');
    var cart = req.cookies.cart;
    var item = req.param('item')
    //console.log(cart);
    if(!cart){
        console.log("no " + req.param('item')._id);
        cart = new userOrder({
            user: req.user ? req.user._id : "",
            items: [],
            salads: [],
            prices: [],
            price: 0
        });
        cart.items.push(item._id);
        cart.prices.push(item.price);
        cart.price += parseInt(item.price);
        cart.save(function(err, cart){
            if(err) return console.error(err);
            console.log(cart);
            res.cookie('cart',cart);
            res.redirect("/");
        });
    } else {
        console.log("yes " +cart);
        userOrder.findOne({_id: cart._id}, function(err, doc){
            if (err) return console.error(err);
            doc.items.push(item._id);
            doc.prices.push(item.price);
            doc.price += parseInt(item.price)
            doc.save(function(err, cart) {
                if (err) return console.error(err);
                console.log(cart);
                res.cookie('cart', cart);
                res.redirect("/");
            });
            //userOrder.update({_id: cart._id}, {items: cart.items}, function(err, doc){})
        })
    }
    //console.log(cart+" "+req.cookies.cart);
});

router.post('/order/salad', function(req, res){
    var cart = req.cookies.cart;
    var size;
    switch (req.param('size')) {
        case 0:
            size = "קטן";
            break;
        case 1:
            size = "בינוני";
            break;
        case 2:
            size = "גדול";
            break;
    }
    var salad = new Salad({
        user: req.user ? req.user._id : "",
        size: size,
        ingredients: req.param('ing'),
        sauce: req.param('suc'),
        extra: req.param('ex'),
        price: 27 +  req.param('size')*4 + ( (req.param('suc').length - 2) > 0 ? (req.param('suc').length - 2) : 0 ) * 2 + ( (req.param('ex').length - 1) > 0 ? (req.param('ex').length - 1) : 0 ) * 4
    });
    salad.save(function(err, saladF){
        if (err) return console.error(err);
        if(cart){
            userOrder.findOne({_id: cart._id}, function(err, cartF){
                cartF.salads.push(saladF);
                cartF.save();
                res.cookie('cart', cartF);
                res.send(saladF);
            });
        } else {
            cart = new userOrder({
                user: req.user ? req.user._id : "",
                salads : [],
                items: []
            });
            cart.salads.push(saladF);
            cart.save(function(err, cartF){
                if (err) return console.error(err);
                res.cookie('cart', cartF);
                res.send(saladF);
            });
        }
    });
});

router.post('/deleteCookie', function(req, res){
    console.log(req.cookies.cart+" is deleted")
    res.clearCookie('cart');
    res.redirect('/');
});

module.exports = router;
