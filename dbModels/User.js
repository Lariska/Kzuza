var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    username: String,
    password: String
});

//userSchema.virtual('name.full').get(function(){
//    return this.name.first + ' ' + this.name.last;
//});

module.exports = mongoose.model('User', userSchema);