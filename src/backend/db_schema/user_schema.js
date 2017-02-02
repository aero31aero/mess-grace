var mongoose = require('mongoose');

var user_Schema = new mongoose.Schema({
	google:{
		id           : String,
        token        : String,
        email        : String,
        name         : String
	},
	grace:{
		date 		 : Array
	}
},{collection:'reg_users'});

module.exports = mongoose.model('reg_users', user_Schema);