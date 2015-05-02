/**
 * Created by aleckim on 2015. 5. 3..
 */

"use strict";

var req = require('request');

var keepAlive = {
    sendMsg: function () {
        var url = "http://localhost:3000";
        req.get(url, function (error, response, body) {
            if (error) {
                console.error(error);
                return callback(error);
            }

            console.log(body);
        });
    }
};

module.exports = keepAlive;

