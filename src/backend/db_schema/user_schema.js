var mongoose = require('mongoose');

var user_Schema = new mongoose.Schema({
	google:{
		id           : String,
        token        : String,
        email        : String,
        name         : String
	},
	grace:{
		date1		 : Date,
		date2		 : Date,
		date3		 : Date,
		date4		 : Date
	}
},{collection:'reg_users'});

module.exports = mongoose.model('reg_users', user_Schema);