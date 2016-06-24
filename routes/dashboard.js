var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/passport')(passport);

// Protect dashboard route with JWT
router.get('/', passport.authenticate('jwt', {session: false}), function (req, res) {
    res.send('It worked! User id is: ' + req.user._id + '.');
});

module.exports = router;