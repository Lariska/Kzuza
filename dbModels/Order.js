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

var userOrderSchema = new Schema({
    user: String,
    items: [String],
    salads: [String],
    prices: [Number],
    price: Number
});

userOrderSchema.virtual('fullPrice').get( function(){
    var price = 0;
    var p;
    for (p in this.prices){
        price += p;
    }
    return price;
});



exports.Order = mongoose.model('Order', orderSchema);

exports.userOrder = mongoose.model('userOrder', userOrderSchema);