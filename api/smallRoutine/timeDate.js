var express = require('express');
var router = express.Router();
var request = require('request');

//日期
router.get('/d', function(req, res, next) {
    let { date, key } = req.query;
    request({
        url: "http://v.juhe.cn/laohuangli/d",
        method: "GET",
        qs: {
            date,
            key
        }
    }, function(error, response, body) {
        res.send(body)
    })
});

router.get('/h', function(req, res, next) {
    let { date, key } = req.query;
    request({
        url: "http://v.juhe.cn/laohuangli/h",
        method: "GET",
        qs: {
            date,
            key
        }
    }, function(error, response, body) {
        res.send(body)
    })
});



module.exports = router;