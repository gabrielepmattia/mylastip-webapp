var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var config = require('../config/common');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
// Pass passport for configuration
require('../config/passport')(passport);

// Connect to database
mongoose.connect(config.database);

// Create a new user account (POST http://localhost:8080/api/signup)
router.post('/signup', function (req, res) {
    if (!req.body.name || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User({
            name: req.body.name,
            password: req.body.password
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function (req, res) {
    User.findOne({
        name: req.body.username
    }, function (err, user) {
        if (err) throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token that will contain the entire
                    // user's record with id, username, password, ecc..
                    var token = jwt.sign(user, config.secret, {
                        expiresIn: 10080 // in seconds
                    });
                    // return the information including token as JSON
                    res.json({success: true, token: token});
                    //res.render('authenticate', {token: token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

router.post('/check-in', function (req, res) {

});


module.exports = router;