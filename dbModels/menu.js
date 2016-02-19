var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
    name: String,
    title: String,
    //description: String,
    image: String,
    items: [Schema.ObjectId]
    //items: [ {type : Schema.ObjectId, ref : 'Package'} ]
});

var menuItemSchema = new Schema({
    titleID: String,
    name: String,
    price: String,
    description: String,
    image: String
});


exports.menu = mongoose.model('menu', menuSchema);
exports.menuItem = mongoose.model('menuItem', menuItemSchema);