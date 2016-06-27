var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);

// Protect dashboard route with JWT
router.get('/', passport.authenticate('jwt', {session: false, failureRedirect: "/login"}), function (req, res) {
    //res.send('It worked! User id is: ' + req.user._id + '.');
    res.sendfile('./public/views/members/index.html');
});

module.exports = router;