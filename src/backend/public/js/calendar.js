// t = year n = month

$(function() {
    function fill_date_divs() {
        fill_weekdays();
        var e = make_date_array();
        var blank_before = 0;
        var blank_check = false;
        fill_dates.empty();
        while (!blank_check) {
            if (day_names[blank_before] == e[0].weekday) {
                blank_check = true
            } else {
                fill_dates.append('<div class="blank"></div>'); //blank divs before 1st of month
                blank_before++; // counting blank divs before
            }
        }
        for (var c = 0; c < 42 - blank_before; c++) { //to fill date divs
            if (c >= e.length) {
                fill_dates.append('<div class="blank"></div>') //blank divs after last day of month
            } else {
                var date = e[c].day;
                var opening_div = check_today(new Date(year, month - 1, date)) ? '<div class="today">' : "<div id=" + date + " class='not_today'>"; //to create div for today or another day
                fill_dates.append(opening_div + "" + date + "</div>") //fill dates in calendar
            }
        }
        var month_color = month_day_colors[month - 1];
        fill_month.css("background-color", month_color).find("h1").text(month_names[month - 1] + " " + year);
        fill_days.find("div").css("color", month_color);
        fill_dates.find(".today").css("background-color", month_color);
        d()
    }

    function make_date_array() { //make array of objects with date and day
        var date = [];
        for (var r = 1; r < get_date(year, month) + 1; r++) {
            date.push({
                day: r,
                weekday: day_names[get_day(year, month, r)]
            })
        }
        return date
    }

    function fill_weekdays() { //fill first 3 letters of weekdays
        fill_days.empty();
        for (var i = 0; i < 7; i++) {
            fill_days.append("<div>" + day_names[i].substring(0, 3) + "</div>")
        }
    }

    function d() {
        var year;
        var month = $("#calendar").css("width", e + "px");
        month.find(year = "#calendar_weekdays, #calendar_content").css("width", e + "px").find("div").css({
            width: e / 7 + "px",
            height: e / 7 + "px",
            "line-height": e / 7 + "px"
        });
        month.find("#calendar_header").css({
            height: e * (1 / 7) + "px"
        }).find('i[class^="icon-chevron"]').css("line-height", e * (1 / 7) + "px")
    }

    function get_date(year, month) {
        return (new Date(year, month, 0)).getDate(); //returns last date of a month
    }

    function get_day(year, month, date) {
        return (new Date(year, month - 1, date)).getDay();
    }

    function check_today(date) {
        return compare_date(new Date) == compare_date(date)
    }

    function compare_date(date) {
        return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate()
    }

    function today_date() {
        var date = new Date;
        year = date.getFullYear();
        month = date.getMonth() + 1
        return date.getDate();
    }
    var e = 480;
    //var year = 2013;
    //var month = 9;

    var r = [];
    var month_names = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    var day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var month_day_colors = ["#16a085", "#1abc9c", "#c0392b", "#27ae60", "#FF6860", "#f39c12", "#f1c40f", "#e67e22", "#2ecc71", "#e74c3c", "#d35400", "#2c3e50"];
    var calendar = $("#calendar");
    var fill_month = calendar.find("#calendar_header");
    var fill_days = calendar.find("#calendar_weekdays");
    var fill_dates = calendar.find("#calendar_content");
    var today_date = today_date();
    fill_date_divs();
    fill_month.find('i[class^="icon-chevron"]').click(function() {
        var icon = $(this);

        function month_change(change_month) { //to change month, change_month = previous or next
            //month = (change_month == "next") ? month + 1 : month - 1;
            month = change_month;
            if (month < 1) {
                month = 12;
                year--
            } else if (month > 12) {
                month = 1;
                year++
            }
            fill_date_divs()
        };
        if (icon.attr("class").indexOf("left") != -1) { //if left is present in icon
            month_change(month - 1)
        } else {
            month_change(month + 1)
        }
    })

    var counter = 0;
    var grace_days = [];
    fill_dates.find('.today, .not_today').click(function() {
        var date_selected = $(this).attr("id");
        var confirmation;
        if (date_selected > today_date) {
            swal({
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then(function() {
                swal(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )
            })
        }

        if (confirmation == true && counter < 4) {
            grace_days.push(date_selected);

            function check_consecutive(grace_days) {
                var c = 0;
                grace_days.sort();
                /*console.log(grace_days[0]);
                console.log(grace_days[1]);
                console.log(grace_days[2]);
                console.log(grace_days[3]);
                console.log(grace_days.length);*/
                for (var i = 0; i < grace_days.length; i++) {
                    if ((1 + parseInt(grace_days[i])) == parseInt(grace_days[i + 1]) && (2 + parseInt(grace_days[i])) == parseInt(grace_days[i + 2])) {
                        c++;
                    }
                }
                console.log(c);
                return c;
            }
            var check = check_consecutive(grace_days);
            if (check == 1) {
                grace_days.pop();
                alert("Cannot put grace on more than 2 consecutive days");
            } else {
                $(this).css({

                    "background-color": "yellow"
                });
                counter++;
            }
        } else if (counter >= 4) {
            alert("Cannot put more than 4 days of grace");
        }
    })

})