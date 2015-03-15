var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ingredientsSchema = new Schema({
    name: String,
    label: String,
    type: String
});

var saladSchema = new Schema({
    user: String,
    cart: String,
    ingredients: [],
    sauce: [],
    extra: []
});

//saladSchema.methods.addIng = function(ing){
//    this.ingredients.push(ing);
//};
//
//saladSchema.methods.removeIng = function(ing){
//    this.ingredients.forEach(function(ingr){
//
//    });
//};

saladSchema.virtual('allIngredients').get(function(){});

exports.ingredients = mongoose.model('ingredients', ingredientsSchema);

exports.salad = mongoose.model('salad', saladSchema);