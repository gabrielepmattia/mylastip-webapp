var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var passport = require('passport');
var config = require('../config/common');
var secret = require('../config/secret');
var User = require('../models/user');
var jwt = require('jsonwebtoken');
// Pass passport for configuration
require('../config/passport')(passport);

// Connect to database
mongoose.connect(config.database);

// Create a new user account (POST http://localhost:8080/api/signup)
router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password || !req.body.email) {
        res.json({success: false, msg: 'Some required fields are missing. :('});
    } else {
        var newUser = new User({
            email: req.body.email,
            username: req.body.username,
            name: req.body.name,
            password: req.body.password
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({success: false, msg: 'Username or email are already registered.'});
            }
            res.json({success: true, msg: 'Account has been created.'});
        });
    }
});

// route to authenticate a user (POST http://localhost:8080/api/authenticate)
router.post('/authenticate', function (req, res) {
    User.findOne({
        username: req.body.username
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
                    var token = jwt.sign({
                        id: user.id,
                        username: user.username
                    }, secret.secret, {
                        expiresIn: 10080 // in seconds
                    });
                    console.log(user);
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

/**
 * Members Area apis
 */
router.post('/get_user_devices', function (req, res) {

});

router.post('/add_user_device', function (req, res) {

});


/**
 * Raspberry apis
 */

router.post('/check-in', function (req, res) {

});


module.exports = router;