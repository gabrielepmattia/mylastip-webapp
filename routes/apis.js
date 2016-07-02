// Libs
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jsonwebtoken');
var getIP = require('ipware')().get_ip;
// Common
var config = require('../config/common');
var secret = require('../config/secret');
var utils = require('../config/utils');
// Models
var User = require('../models/user');
var Device = require('../models/device');
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
            password: req.body.password,
            registered_on: utils.unixTimestamp(),
            timezone: 0 // TODO implement timezone choosing (moment.js)
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                console.log(err.toString());
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
/**
 * Get all user devices
 */
router.post('/get_user_devices', passport.authenticate('jwt', {
    session: false,
    failureRedirect: "/login"
}), function (req, res) {
    Device.find({owner_id: req.user.id}, function (err, devices) {
        if (err) throw err;
        if (devices.length == 0) return res.json({success: false, msg: "No device for current user!"});
        else {
            devices.sort(function (a, b) {
                return a.ordering_number - b.ordering_number
            });
            return res.json({success: true, devices: devices});
        }
    });
});

/**
 * Add one device to user
 */
router.post('/add_user_device', passport.authenticate('jwt', {
    session: false,
    failureRedirect: "/login"
}), function (req, res) {
    if (!req.body.name) {
        res.json({success: false, msg: "Name is required!"});
    } else {
        // Search for user devices
        Device.find({owner_id: req.user.id}, function (err, devices) {
            if (err) throw err;
            // Create new device obj
            var device_order = req.body.order ? req.body.order : devices.length + 1;
            var registered_on = utils.unixTimestamp();
            var newDevice = new Device({
                owner_id: req.user.id,
                ordering_number: device_order,
                name: req.body.name,
                key: req.body.name + "." + req.user.id + registered_on,
                registered_on: registered_on
            });
            // Finally save it
            newDevice.save(function (err) {
                if (err) return res.json({success: false, msg: err.toString()});
                else res.json({
                    success: true,
                    msg: 'Device ' + newDevice.name + ' has been created. Key is ' + newDevice.key
                });
            });
        });
    }
});

/**
 * Get one device from database
 */
router.post('/get_device_info', passport.authenticate('jwt', {
    session: false,
    failureRedirect: "/login"
}), function (req, res) {
    if (!req.body.id) {
        res.json({success: false, msg: "ID is required!"});
    } else {
        // Search for user devices
        Device.findOne({_id: req.body.id}, function (err, device) {
            if (err) throw err;
            if (!device) res.json({success: false, msg: "No device."});
            else res.json({success: true, device: device});
        });
    }
});

/**
 * Remove all logdata for device
 */
router.post('/remove_all_logdata', passport.authenticate('jwt', {
    session: false,
    failureRedirect: "/login"
}), function (req, res) {
    if (!req.body.id) {
        res.json({success: false, msg: "ID is required!"});
    } else {
        // Search for user devices
        Device.findOne({_id: req.body.id}, function (err, device) {
            if (err) throw err;
            if (!device) res.json({success: false, msg: "No device for this owner."});
            else {
                var conditions = {_id: req.body.id},
                    update = {
                        $pull: {
                            logdata: {
                                $exists: true
                            }
                        }
                    },
                    options = {};

                Device.update(conditions, update, options, function (err) {
                    if (err) return res.json({success: false, msg: err.toString()});
                    return res.json({success: true, msg: "Cleared logdata for device!"});
                });
            }
        });
    }
});


/**
 * Raspberry apis
 */

/**
 * Format that come from raspy is
 * {
 *      key: "<key>",
 *      delay: <seconds>
 * }
 */

router.post('/check_in', function (req, res) {
    if (!req.body.key) return res.json({
        success: false,
        msg: "Key has not been provided! Please add it to settings.json or download the setting file from the website"
    });

    var conditions = {key: req.body.key},
        update = {
            delay: req.body.delay,
            uname: req.body.uname,
            $push: {
                logdata: {
                    $each: [{timestamp: utils.unixTimestamp(), ip: req.connection.remoteAddress}],
                    //$sort: -1
                }
            }
        },
        options = {safe: true, upsert: true, new: true};

    Device.update(conditions, update, options, function (err) {
        if (err) return res.json({success: false, msg: err.toString()});
        return res.json({success: true, msg: "Data saved to server!"});
    });
});

module.exports = router;