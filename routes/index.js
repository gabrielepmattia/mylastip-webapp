var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'MyLastIP'});
});

router.get('/login', function (req, res, next) {
    res.render('login', {title: 'MyLastIP | Login'});
});

module.exports = router;