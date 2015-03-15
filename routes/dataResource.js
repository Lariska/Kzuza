var express = require('express');
var router = express.Router();
var menu = require('../dbModels/menu').menu;
var menuItem = require('../dbModels/menu').menuItem;
var ingredients = require('../dbModels/Salad').ingredients;
var userOrder = require('../dbModels/Order').userOrder;


router.get('/admin', function(req,res){
    res.render('admin');
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
    menuItem.find({titleID: id},function(err, item){
        if(err) return console.error(err);
        res.send(item);
    });
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
    console.log(cart);
    userOrder.findOne({_id: cart._id}, function(err, order){
        if (err) return console.error(err);
        console.log(order);
        res.send(order);
    });
});

module.exports = router;