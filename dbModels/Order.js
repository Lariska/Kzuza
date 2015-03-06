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
    comments: String,
    payed_with_cash: Boolean,
    credit_card: {type: Schema.Types.ObjectId, ref: 'Credit'}
});

module.exports = mongoose.model('Order', orderSchema);