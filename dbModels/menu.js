var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var menuSchema = new Schema({
    title: String,
    //description: String,
    image: String,
    items: [Schema.objectId]
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