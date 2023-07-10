var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var router = express.Router();
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var profileRouter = require('./routes/profile');
var courseRouter = require('./routes/course');
var documentRouter = require('./routes/document');
var mediaRouter = require('./routes/media');
var publicRouter = require('./routes/public');
var adminRouter = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

router.use('/', indexRouter);
router.use('/auth', authRouter);
router.use('/profile', profileRouter);
router.use('/course', courseRouter);
router.use('/document', documentRouter);
router.use('/media', mediaRouter);
router.use('/public', publicRouter);
router.use('/admin', adminRouter);

app.use('/api',router);




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
  res.json(`Error occured ${err.status || 500}`);
});

module.exports = app;
