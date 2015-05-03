/**
 * Created by aleckim on 2015. 5. 3..
 */

"use strict";

var req = require('request');

var keepAlive = {
    sendMsg: function () {
        var url = "http://ggirsv.herokuapp.com";
        req.get(url, function (error, response, body) {
            if (error) {
                console.error(error);
                return;
            }

            //console.log(body);
        });
    }
};

module.exports = keepAlive;

