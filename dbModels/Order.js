var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    take_away: Boolean,
    status: { type: String, enum: ["in progress", "completed", "delivered"] },
    city: String,
    street: String,
    house_number: String,
    apartment_number: String,
    floor: String,
    comments: String
});

module.exports = mongoose.model('Order', orderSchema);