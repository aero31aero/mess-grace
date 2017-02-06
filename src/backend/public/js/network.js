var network = function() {
    var getRequest = function() {
        var xmlhttp = new XMLHttpRequest();
        return xmlhttp;
    };

    var postGrace = function(date, callback) {
        var request = getRequest();
        request.open("GET", "/users/addgrace?date="+date);
        request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(null,JSON.parse(request.responseText));
                return;
            }
            if (this.readyState == 4 && this.status != 200){
            	callback(this.status);
            	return;
            }
        };
        request.send(date);
    };

    var getUpcomingGraces = function(callback) {
    	var request = getRequest();
        request.open("GET", "/users/getgrace");
        request.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                callback(false,JSON.parse(request.responseText));
                return;
            }
            else{
            	callback(this.status);
            	return;
            }
        };
        request.send();
    };

    return {
        postGrace: postGrace,
        getUpcomingGraces: getUpcomingGraces,
    }
}();