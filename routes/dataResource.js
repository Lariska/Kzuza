var express = require('express');
var router = express.Router();
var menu = require('../dbModels/menu').menu;
var menuItem = require('../dbModels/menu').menuItem;


router.get('/admin', function(req,res){
    res.render('admin');
});

router.get('/menu/:id?', function(req, res){
    menu.find(function (err, titles){
        if(err) return console.error(err);
        titles.forEach(function(title){
            menuItem.find({titleID: title._id}, function(err, menuItems){
                if (err) return console.error(err);
                title.items = menuItems;
            });
        });
        res.send(titles);
    });
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

module.exports = router;