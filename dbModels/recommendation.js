var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recommendationSchema = new Schema({
    date: String,
    subject: String,
    name: String,
    text: String
});

exports.recommendations = mongoose.model('recommendations', recommendationSchema);