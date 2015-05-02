/**
 *
 * Created by aleckim on 2015. 4. 26..
 */

"use strict";

var req = require('request');

var GGI_URL = "http://www.ggihub.or.kr";

function _makeLogin() {
    var loginInfo = {};
    loginInfo.user_id = "aleckim";
    loginInfo.user_pw = "";
    return loginInfo;
}

function _checkLoginResponse(response) {
    if (response === '1') {
        console.log("Login Success");
        return true;
    }
    else if (response === '2') {
        console.log("ID was paused");
    }
    else if (response === '3') {
        console.log("ID was removed");
    }
    else if (response === '99') {
        console.log("Fail to find encrypted secret key");
    }
    else {
        console.log("id/pw is not correct");
    }
    return false;
}

//var url = "/common/SeedEncryption?passwd="+encodeURIComponent($("#login_user_pw_tmp").val()).trim();
function _encrypt(textPwd, callback) {
    var url = GGI_URL + "/common/SeedEncryption";
    url += '?passwd=' + encodeURIComponent(textPwd).trim();
    req.get(url, function (error, response, body) {
        if (error) {
            console.error(error);
            callback(error);
        }
        console.log(body);
        var encryptedPw = JSON.parse(body).passwd;
        console.log(encryptedPw);
        callback(null, encryptedPw);
    });
}

function _postLogin(userId, userEncryptedPwd, callback) {
    var url = GGI_URL + '/front/doLogin';

    var data = {
        user_id: userId,
        user_pw: userEncryptedPwd
    };

    console.log('url=' + url);
    console.log(data);

    req.post(url, {
        json: false,
        form: data
    }, function (error, response, body) {
        if (error) {
            console.error(error);
            return callback(error);
        }
        console.log(body);
        callback(null, body);
        //callback(null, true);
    });
}

function doLogin(callback) {
    var userInfo = _makeLogin();

    _encrypt(userInfo.user_pw, function (error, encryptedPwd) {
        if (error) {
            console.error(error);
            return callback(error);
        }
        _postLogin(userInfo.user_id, encryptedPwd, function (error, body) {
            if (error) {
                console.error(error);
                return callback(error);
            }
            _checkLoginResponse(body);
            callback(null, body);
        });
    });
}

function getRsv(roomName, hourStart, durationHour, callback) {
    var url = GGI_URL + ':8081/library/putReserve_Sql.php';
    var roomClass = 'project';
    var seatCode;
    var roomCode = '9';
    var userSNO;
    var userInfo = _makeLogin();

    userSNO = userInfo.user_id;

    if (roomName == 'R26') {
        seatCode = '4';
    }
    else if (roomName == 'R27') {
        seatCode = '5';
    }
    else if (roomName == 'R25') {
        seatCode = '3';
    }
    else if (roomName == 'M05') {
        seatCode = '3';
    }

    if (durationHour > 6) {
        console.error('Max duration is 6 so durationHour was set to 6');
        durationHour = '6';
    }

    url += '?';
    url += 'RoomName=' + roomName;
    url += '&' + 'RoomClass=' + roomClass;
    url += '&' + 'SeatCode=' + seatCode;
    url += '&' + 'RoomCode=' + roomCode;
    url += '&' + 'UserSNO=' + userSNO;
    url += '&' + 'HourStart=' + hourStart;
    url += '&' + 'DurationHour=' + durationHour;

    //putReserve_Sql.php?RoomName=R25&RoomClass=project&SeatCode=3&RoomCode=9&UserSNO=aleckim&HourStart=21&DurationHour=1
    //"./putReserve_Sql.php?RoomName=R23&RoomClass=project&SeatCode=1&RoomCode=9&UserSNO=aleckim&HourStart=20&DurationHour=1"
    //"./putReserve_Sql.php?RoomName=R24&RoomClass=project&SeatCode=2&RoomCode=9&UserSNO=aleckim&HourStart=13&DurationHour=1"
    //"./putReserve_Sql.php?RoomName=R27&RoomClass=project&SeatCode=5&RoomCode=9&UserSNO=aleckim&HourStart=12&DurationHour=1"
    //"./putReserve_Sql.php?RoomName=M05&RoomClass=meeting&SeatCode=3&RoomCode=9&UserSNO=aleckim&HourStart=20&DurationHour=1"
    console.log(url);

    req.get(url, function (error, response, body) {
        if (error) {
            console.error(error);
            return callback(error);
        }

        //{"result":1,"authcode":"1788"}
        //console.log(body);
        callback(null, body);
    });
}

function addRsvToList(roomName, hourStart, durationHour, callback) {
    //write file.
    console.log("roomName=" + roomName + " hourStart=" + hourStart + " durationHour=" + durationHour);
    return callback("");
}

function clearRsvList(callback) {
    //del list or remove file
    return callback("");
}

function rsvList(callback) {
    //read file
    //return callback
    return callback("");
}

/***
 * @param day (0-6) 0 is sunday
 * @param time (0-23)
 * @description set UTC time
 */
function calcRsvTime(targetDay, targetTime) {
    var second = 1000;
    var minute = second * 60;
    var hour = minute * 60;
    var day = hour * 24;

    var d = new Date();
    //plus reservation day -1;
    var triggerTime;
    var calDay;
    var calHour;
    var addDay = 0;
    var calMinute = 60 - (d.getUTCMinutes() + 1);
    var calSecond = 60 - (d.getUTCSeconds());

    if (targetTime < d.getUTCHours()) {
        targetTime += 24;
        addDay = 1;
    }
    calHour = targetTime - (d.getUTCHours() + 1);

    if (targetDay < d.getUTCDay() + addDay) {
        targetDay += 6;
    }
    calDay = targetDay - d.getUTCDay();

    triggerTime = calDay * day;
    triggerTime += calHour * hour;
    triggerTime += calMinute * minute;
    triggerTime += calSecond * second;
    console.log('current UTC Date=' + d.toUTCString());
    console.log('calDay=' + calDay + ' calHour=' + calHour + ' calMinute=' + calMinute + ' calSec=' + calSecond);
    d.setTime(d.getTime() + triggerTime);
    console.log('target UTC=' + d.toUTCString());
    console.log('target Date=' + d);

    return triggerTime;
}

var rsv = {
    doLogin: doLogin,
    getRsv: getRsv,
    addRsvToList: addRsvToList,
    clearRsvList: clearRsvList,
    calcRsvTime: calcRsvTime,
    rsvList: rsvList
};

module.exports = rsv;




