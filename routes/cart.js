var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.isLogin != 1) { // 表示未登录
        res.redirect('/login'); // 跳转到登录页面
        return; // 代码将不再继续往下执行
    }
    res.render('cart', {
        activeIndex: 4
    });
});

module.exports = router;