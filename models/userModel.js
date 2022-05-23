var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'nama' : String,
	'email' : String,
	'password' : String,
	'username' : String,
	'telepon' : String,
	'role ' : String
});

module.exports = mongoose.model('user', userSchema);
