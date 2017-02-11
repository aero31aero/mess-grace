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
		var y1 = 0;
		var	y2 = 0;
		var	t1 = 0;
		var	t2 = 0;
		var day = moment.unix(date/1000);
		console.log(day);
		array.forEach(function(elem){
			console.log(elem);
			elem = moment.unix(elem/1000);
			if(elem == day.add(1,'days')){
				t1 = 1;
				console.log('t1'+t1);
			}else if(elem == day.add(2,'days')){
				t2 = 1;
				console.log('t2'+t2);
			}else if(elem == day.subtract(1,'days')){
				y1 = 1;
				console.log('y1'+y1);
			}else if(elem == day.subtract(2,'days')){
				y2 = 1;
				console.log('y2'+y2);
			}
		});

		if((t1 == 1 && t2 == 1) || (y1 == 1 && y2 == 1) || (y1 == 1 && t1 == 1)){
			console.log('consecutive error');
			return false;
		}else{
			console.log('safe to go');
			return true;
		}
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
		if(count>=3){
				return false;
		}
		return true;
	}

	var test = function(date,array){
		if(!backdate(date)) return "Well played. Try harder. :)";
		if(!compare(date,array)) return "You already have a grace marked for this day.";
		if(!consecutive(date,array)) return "You cannot put more than 2 consecutive graces.";
		if(!limit(date,array)) return "You can only put 3 graces/month online.";
		return true;
	}

	return test;
}();
