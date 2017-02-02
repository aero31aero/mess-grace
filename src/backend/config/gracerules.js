//not more than 2 consecutive graces
//not more than 4 grace per month
//day compare for existence
module.exports = function(){
	var moment = require('moment');
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
		if(!compare(date,array)) return "Duplicate";
		if(!consecutive(date,array)) return "Consecutive";
		if(!limit(date,array)) return "Limit";
		return true;
	}

	return test;
}();
