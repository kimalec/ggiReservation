/**
 * Created by aleckim on 2015. 4. 26..
 */

var rsv = require('../controllers/rsv');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.send('called' + req.url);
});

router.get('/doLogin', function (req, res, next) {
    rsv.doLogin(function (error, body) {
        if (error) {
            console.error(error);
            return res.send(error);
        }
        res.send(body);
    });
});

router.get('/getRsv', function (req, res, next) {
    rsv.getRsv('R25', '21', '1', function (error, body) {
        if (error) {
            console.error(error);
            return res.send(error);
        }
        //{"result":1,"authcode":"1788"}
        res.send(body);
    });
});

router.get('/rsvList', function (req, res, next) {
    rsv.rsvList(function (error, body) {
        if (error) {
            console.error(error);
            return res.send(error);
        }
        res.send(body);
    });
});

module.exports = router;
