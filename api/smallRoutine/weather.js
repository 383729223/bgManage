var express = require('express');
var router = express.Router();
var request = require('request');

//天气
router.get('/', function(req, res, next) {
    let { city, key } = req.query;
    request({
        url: "http://apis.juhe.cn/simpleWeather/query",
        method: "GET",
        qs: {
            city,
            key
        }
    }, function(error, response, body) {
        res.send(body)
    })
});



module.exports = router;