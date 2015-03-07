var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    username: String,
    password: String,
    openId: String,
    orders:[
        {type: Schema.Types.ObjectId, ref: 'Order'}
    ]
});

//userSchema.virtual('name.full').get(function(){
//    return this.name.first + ' ' + this.name.last;
//});

module.exports = mongoose.model('User', userSchema);