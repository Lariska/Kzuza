var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ingredientsSchema = new Schema({
    name: String,
    label: String,
    type: String
});

exports.ingredients = mongoose.model('ingredients', ingredientsSchema);