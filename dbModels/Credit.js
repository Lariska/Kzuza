var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var creditSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    card_number: String,
    year: Number,
    month: Number,
    id: String,
    name: String,
    secret_number: Number
});

module.exports = mongoose.model('Credit', creditSchema);