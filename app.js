var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var ggirsv = require('./routes/ggirsv');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/ggirsv', ggirsv);

var rsv = require('./controllers/rsv');

function runRsv() {
    console.log('runRsv');
    console.log(Date());

    rsv.getRsv('R26', '10', '6', function (error, body) {
        if (error) {
            return console.error(error);
        }
        //{"result":1,"authcode":"1788"}
        console.log(body);
    });

    rsv.getRsv('R26', '16', '6', function (error, body) {
        if (error) {
            return console.error(error);
        }
        console.log(body);
    });

    rsv.getRsv('R25', '10', '6', function (error, body) {
        if (error) {
            return console.error(error);
        }
        console.log(body);
    });

    setTimeout(setRsv, 60 * 1000 * 61); //setRsv after 1hour, 1min
}

function setRsv() {
    console.log('setRsv');
    var triggerTime;
    //setTimeout when run sunday 6am UTC is saturday 21pm
    triggerTime = rsv.calcRsvTime(6, 21);

    setTimeout(runRsv, triggerTime);
    //setTimeout(runRsv, 2*1000);
}

{
    setRsv();
}

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
