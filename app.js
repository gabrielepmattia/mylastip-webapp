var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('jwt-simple');
var config = require('./config/common');
var User = require('./models/user');

// Instantiate the app
var app = express();

// view engine setup -- no longer needed with angular
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Instantiate the routes
//var routes = require('./routes/index');
//var users = require('./routes/users');
var apis = require('./routes/apis');
var members = require('./routes/members');
// And use the routes in the app
//app.use('/', routes);
//app.use('/users', users);
app.use('/api', apis);
app.use('/members/*', members);

// Main route to catch the angular routes
app.get('*', function(req, res) {
    res.sendfile('./public/views/index.html'); // only index.html is served
});

/*
app.get('*', passport.authenticate('jwt', {session: false}), function (req, res) {
    res.sendfile('./public/views/index.html');
});
*/

// Prepare passport
app.use(passport.initialize());

/**
 * Error handlers
 */
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;