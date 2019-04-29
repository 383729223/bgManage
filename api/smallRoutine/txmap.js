var express = require('express');
var router = express.Router();
var request = require('request');

//根据经纬度转换地理位置
router.get('/', function(req, res, next) {
    let { location, key } = req.query;
    request({
        url: "https://apis.map.qq.com/ws/geocoder/v1/",
        method: "GET",
        qs: {
            location,
            key
        }
    }, function(error, response, body) {
        res.send(body)
    })
});



module.exports = router;