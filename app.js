var createError = require('http-errors');
var express = require('express');
var path = require('path');
//var cookieParser = require('cookie-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);

var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishsRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leadeRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');

var app = express();

// Secure traffic only
app.all('*', (req, res, next) => {
  if (req.secure) {
    return next();
  }
  else {
    res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
  }
});
const mongoose = require('mongoose');

//const url = 'mongodb://localhost:27017/conFusion';
const url = config.mongoUrl;
const dbconnection = mongoose.connect( url );

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//var tempSecretKey = 'abcde-12345-efghi-45678-lmnop-78901';
//app.use(cookieParser(tempSecretKey));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishsRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leadeRouter);
app.use('/imageUpload',uploadRouter);

dbconnection.then( db =>{
  console.log("Connected successfully to MongoDB server.");
}, err => { console.log( err );});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
