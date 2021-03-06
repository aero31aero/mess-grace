var express = require('express');
var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');
var passport = require('passport');
var user = require('../db_schema/user_schema');
var gracerules = require('../config/gracerules');
var moment = require('moment');
var fs = require('fs');
path = require('path');

var router = express.Router();
require('../config/passport')(passport);

mongoose.connect('mongodb://localhost/messgrace');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.redirect('/calender');
});

//get request display signup page
router.get('/signup', function(req, res) {
    res.render('signup');
});

//get request to display login page
router.get('/login', function(req, res) {
    error = req.query.error;
    res.render('login', {
        error: error
    });
});



//display home for the logged in user
router.get('/calender', function(req, res) {
    if (!req.session.user) {
        res.redirect('login', {
            error: req.query.error
        });
    } else if (req.session.user) {
        res.render('index', {
            user: req.session.user
        });
    }
});
//logout the user and destroy the session
router.get('/logout', function(req, res) {
    if (req.session.user) {
        req.session.destroy();
        res.redirect('/users/login?error=Logged Out');
        console.log('true');
    } else {
        res.redirect('/users/login?error=Logged Out');
    }
});
router.get('/dashboard', function(req, res) {
    // file.find({username: req.session.user}).sort('-createdAt').exec(function(err, files){
    //     if(err) throw err;
    //     else{
    //         res.render('dashboard',{
    //             files: files
    //         });
    //     }
    // });
    res.send("under construction come back later!");
});

//grace date
router.get('/addgrace', function(req, res) {
    date = req.query.date
    user.findOne({
        'google.name': req.session.user
    }).exec(function(err, username) {
        if (err) console.log(err);
        else if (!username) {
            console.log('no user');
            res.redirect('/users/logout');
        } else {
            var gracetest = gracerules(date, username.grace.date)
            if (gracetest !== true) {
                console.log("Grace Error:", gracetest);
                res.status(200).json({
                    granted: false,
                    errormessage: gracetest
                });
                return;
            }
            username.grace.date.push(date);
            username.save(function(err, saveduser) {
                if (err) {
                    console.log(err)
                } else {
                    console.log('grace granted');
                    res.status(200).json({
                        granted: true
                    });
                }
            })
        }
    })


});

router.get('/getgrace', function(req, res) {
    user.findOne({
        'google.name': req.session.user
    }).exec(function(err, ouruser) {
        if (!ouruser) {
            console.log('no user');
            res.redirect('/users/logout');
        } else if (err) console.log(err);
        else {
            gracearray = ouruser.grace.date;
            res.status(200).json(gracearray);
        }
    });
});
router.get('/removegrace', function(req, res) {
    date = req.query.date;
    user.findOne({
        'google.name': req.session.user
    }).exec(function(err, ouruser) {
        curdate = moment();
        console.log("DATE:", curdate);
        curdate.set({
            hour: 0,
            minute: 0,
            second: 0,
            millisecond: 0
        }).add({
            days: 2
        });
        console.log("DATE 2:", curdate);
        if (curdate.isBefore(moment.unix(date / 1000))) {
            ouruser.grace.date.pull(date);
            ouruser.save(function(err, save) {
                if (err) console.log(err);
                else {
                    res.status(200).json({
                        removed: true
                    });
                }
            })
        } else {
            res.status(200).json({
                removed: false
            });
        }
    });
});
router.get('/download', function(req, res){
    res.render('download');
});

router.post('/download', function(req, res) {
    var username = req.body.name;
    var password = req.body.password;
    var date = req.body.date;
    console.log(date);
    var ts = moment(date + "0:00", "YYYY/M/D H:mm").valueOf()
    console.log(ts);
    console.log(username+'\n'+password+'\n'+date);
    if (username == 'grace' && password == '_praneet') {
        // date = moment()
        // date.set({
        //     hour: 0,
        //     minute: 0,
        //     second: 0,
        //     millisecond: 0
        // }).add({
        //     days: 2
        // });
        // date = String(date.unix() * 1000);
        // console.log(date);
        user.find({
            'grace.date': String(ts)
        }).exec(function(err, user) {
            if (err) {
                console.log(err);
            } else {
                text = 'Name \t\t Id \t\t Date \n';
                user.forEach(function(elem) {
                    text += elem.google.name + ' \t \t \t \t ' + elem.google.email.split('@')[0] + ' \t \t \t \t ' + moment.unix(ts/1000).format("DD/MM") + '\n'
                })
                fs.writeFile("gracefiles/" + moment.unix(ts/1000).format("DD-MM") + ".txt", text, function(err) {
                    if (err) {
                        return console.log(err);
                    } else {
                        var destination = path.resolve(".") + '/gracefiles/' + moment.unix(ts/1000).format("DD-MM") + '.txt';
                        res.download(destination, function(err) {
                            if (err) console.log(err);
                            else {
                                console.log('success');
                            }
                        });
                    }

                });

            }
        })
    }else{
        res.render('download');
    }

});
router.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    }));

router.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/users/login?error=Invalid domain name. Use Bits mail'
    }),
    function(req, res) {
        console.log('The google user details are: ' + req.user);
        req.session.user = req.user.google.name;
        res.redirect('/users/calender');

    });
module.exports = router;