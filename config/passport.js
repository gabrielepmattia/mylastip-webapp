var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var User = require('../models/user');
var config = require('../config/common');
var secret = require('../config/secret');

module.exports = function (passport) {
    var opts = {};
    //opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
    // Now extract jwt from the cookies
    opts.jwtFromRequest = function (req) {
        var token = null;
        if (req && req.cookies) {
            token = req.cookies['token'];
        }
        return token;
    };
    opts.secretOrKey = secret.secret;
    // Set the strategy 
    passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
        User.findOne({_id: jwt_payload.id}, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));
};