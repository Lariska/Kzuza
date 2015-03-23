var express = require('express');
var router = express.Router();
var menu = require('../dbModels/menu').menu;
var menuItem = require('../dbModels/menu').menuItem;
var ingredients = require('../dbModels/Salad').ingredients;
var userOrder = require('../dbModels/Order').userOrder;
var Salad = require('../dbModels/Salad').salad;
var recommendations = require('../dbModels/recommendation').recommendations;

router.get('/admin', function(req,res){
    res.render('admin');
});

router.get('/recommendations', function(req, res){
    res.render('recommendationsPage', {title: "המלצות", user: req.user});
});

router.get('/menu/:name?', function(req, res){
    console.log("------>" + req.param('name') + "<------" )
    if(req.param('name')){
        var name = req.param('name');
        menu.findOne({name: name}, function(err, title){
            if (err) return console.error(err);
            console.log(title.name);
            res.send(title);
        });
    } else {
        //console.log("------>" + req.param('id') + "<------" )
        menu.find(function (err, titles){
            if(err) return console.error(err);
            //titles.forEach(function(title){
            //    menuItem.find({titleID: title._id}, function(err, menuItems){
            //        if (err) return console.error(err);
            //        title.items = menuItems;
            //    });
            //});
            res.send(titles);
        });
    }
});

router.post('/saveRecommend', function(req, res){
    var recommendItem = new recommendations({date: req.param('date'), subject: req.param('subject'), name: req.param('name'), text: req.param('text')});
    recommendItem.save(function(err){
        if (err){
            console.log('Error in Saving menu item: '+err);
            throw err;
        }
        console.log('recommendation saved succesfuly');
    });
    res.redirect('recommendations');
});

router.post('/saveMenu', function(req, res){
    var menuItem = new menu({title: req.param('title'), image: req.param('image'), items:[]});
    menuItem.save(function(err){
        if (err){
            console.log('Error in Saving menu item: '+err);
            throw err;
        }
        console.log('menu item saved succesfuly');
    });
    res.redirect('admin');
});

router.get('/menuItem/:id?',function(req, res){
    var id = req.param('id');
    console.log("DATA - " + id);
    if (req.param('list')) {
        menuItem.find({titleID: id}, function (err, item) {
            if (err) return console.error(err);
            res.send(item);
        });
    }
    if(!req.param('list')){
        //console.log("------>" + req.param('id') + "<------" )
        menuItem.findOne({_id: id}, function(err, data){
            if(err) return console.error(err);
            //console.log(data)
            res.send(data);
        });
    };
});

router.post('/saveMenuItem', function(req, res){
    var innerItem = new menuItem(
        {
            titleID: req.param('titleID'),
            name: req.param('name'),
            price: req.param('price'),
            description: req.param('description'),
            image: req.param('image')
        });
    console.log(innerItem.titleID+" "+innerItem.name);
    innerItem.save(function(err){
        if (err){
            console.log('Error in Saving menu item: '+err);
            throw err;
        }
        console.log('menu item saved succesfuly');
    });
    res.redirect('admin');
});

router.get('/ingredients/:type?', function(req, res){
    if(req.param('type')){
        console.log("------>" + req.param('type') + "<------" );
        var type = req.param('type');
        ingredients.find({type: type}, function(err, data){
            if(err) return console.error(err);
            res.send(data);
        });
    };
});

router.post('/saveIngredients', function(req, res){
    var ing = new ingredients({
        type: req.param('type'),
        name: req.param('name'),
        label: req.param('label')
    });
    ing.save(function(err){
        if (err){
            console.log('Error in Saving menu item: '+err);
            throw err;
        }
        console.log('ingredient saved succesfuly');
    });
    res.redirect('admin');
});

router.get('/order/:id?', function(req, res){
    var cart = req.cookies.cart;
    //console.log(cart);
    if(cart) {
        userOrder.findOne({_id: cart._id}, function (err, order) {
            if (err) return console.error(err);
            console.log("Order: " + order._id);
            res.send(order);
        });
    }
});

router.delete('/order/:id', function(req, res){
    var cart = req.cookies.cart;
    var removeId = req.param('id');
    var price = req.param('price');
    console.log(removeId+"----");
    if(cart){
        userOrder.findOne({_id: cart._id}, function(err, order) {
            if (err) return console.error(err);
            var idx1 = order.items.indexOf(removeId);
            if (idx1 !== -1) order.items.splice(idx1, 1);
            var idx2 = order.salads.indexOf(removeId);
            if (idx2 !== -1) order.salads.splice(idx2, 1);
            order.price -= parseInt(price);
            order.save();
            console.log(order);
            res.cookie('cart', order);
            res.send(order);
        });
    }
});

router.get('/salad/:id', function(req, res){
    Salad.findOne({_id: req.param('id')}, function(err, data){
        if (err) return console.error(err);
        //console.log(data);
        res.send(data);
    });
});

router.post('/salad/:id?', function(req, res){
    var cart = req.cookies.cart;
    var size;
    //var saladP = req.param('salad');
    //console.log(saladP);
    //console.log("size: "+ req.param('size') + "ing: "+ req.param('ing'))
    //return;
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
    //console.log(size)
    var salad = new Salad({
        user: req.user ? req.user._id : "",
        size: size,
        ingredients: req.param('ing'),
        sauce: req.param('suc'),
        extra: req.param('ex'),
        price: 27 +  req.param('size')*4 + ( (req.param('suc').length - 2) > 0 ? (req.param('suc').length - 2) : 0 ) * 2 + ( (req.param('ex').length - 1) > 0 ? (req.param('ex').length - 1) : 0 ) * 4
    });
    //console.log(salad);
    salad.save(function(err, saladF){
        if (err) return console.error(err);
        if(cart){
            userOrder.findOne({_id: cart._id}, function(err, cartF){
                cartF.salads.push(saladF._id);
                cartF.prices.push(saladF.price);
                cartF.price += parseInt(saladF.price);
                cartF.save();
                res.cookie('cart', cartF);
                //console.log(saladF)
                res.send(saladF);
            });
        } else {
            cart = new userOrder({
                user: req.user ? req.user._id : "",
                salads : [],
                items: [],
                prices: [],
                price: 0
            });
            cart.salads.push(saladF._id);
            cart.prices.push(saladF.price);
            cart.price += parseInt(saladF.price);
            cart.save(function(err, cartF){
                if (err) return console.error(err);
                res.cookie('cart', cartF);
                //console.log(saladF);
                res.send(saladF);
            });
        }
    });
});

function asincItems(cart, done){
    var items = [];
    cart.items.forEach(function(item){
        menuItem.findOne({_id: item._id}, function(err, doc){
            items.push(doc);
        })
    })
}

router.get('/fullCart', function(req, res){
    var cart = req.cookies.cart;
    if(cart){
        userOrder.findOne({_id: cart._id}, function(err, doc){
            if (err) return console.error(err);
            res.send(doc);
        });
    }
});

module.exports = router;








