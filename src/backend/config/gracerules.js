//not more than 2 consecutive graces
//not more than 4 grace per month
//day compare for existence
module.exports = function(){
	var moment = require('moment');

	var backdate = function(date){
		var now = moment();
		date = moment.unix(date/1000)
		if(date.isBefore(now)){
			return false;
		}
		return true;
	}

	var compare = function(date, array){
		if(array.indexOf(date) == -1){
			return true;
		}else{
			return false;
		}
	}

	var consecutive= function(date,array){
		return true;
	}

	var limit = function(date,array){
		var lower = moment.unix(date/1000).set('date',1);
		var upper = moment.unix(date/1000).set('date',1).add(1,"months");
		var count = 0;
		array.forEach(function(elem){
			elem = moment.unix(elem/1000);
			if(elem.isBetween(lower,upper)){
				count++;
			}
			
		});
		if(count>=4){
				return false;
		}
		return true;
	}

	var test = function(date,array){
		if(!backdate(date)) return "Well played. Try harder. :)";
		if(!compare(date,array)) return "You already have a grace marked for this day.";
		if(!consecutive(date,array)) return "You cannot put more than 2 consecutive graces.";
		if(!limit(date,array)) return "You can only put 4 graces/month online.";
		return true;
	}

	return test;
}();
