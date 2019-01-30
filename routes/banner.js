var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.isLogin != 1) { // 表示未登录
        res.redirect('/login'); // 跳转到登录页面
        return; // 代码将不再继续往下执行
    }
    sql.find('uqmei', 'banners', {}).then(data => {
        // console.log("111111111", data)
        res.render('banner', {
            activeIndex: 5,
            data
        });
    }).catch(err => {
        console.log(err)
    })

});
router.get('/login', function(req, res, next) {
    res.render('login');
});


//增加一条新的轮播图
router.get('/add', function(req, res, next) {
    res.render('banner_add', {
        activeIndex: 5
    });
});

router.post('/addAction', function(req, res, next) {

    let { bannerId, imgSrc } = req.body;
    if (imgSrc != "" && bannerId != "") {

        bannerId = bannerId * 1;
        sql.find('uqmei', 'banners', { _id: bannerId }).then(data => {
                if (data.length == 0) {
                    // 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
                    // password = md5(password);
                    sql.insert('uqmei', 'banners', { _id: bannerId, bannerSrc: imgSrc })
                        .then(() => {
                            res.redirect('/banner');
                        })
                        .catch((err) => {
                            res.redirect('/banner/add');
                        })
                } else {
                    // 该产品已存在
                    res.redirect('/banner/add');
                }
            }).catch(err => {
                // console.log(err)
                res.redirect('/banner/add');
            })
            // console.log(obj);
    } else {
        res.redirect('/banner');
    }

});
// 删除
router.get('/remove', function(req, res, next) {
    const { _id } = req.query;
    let bannerId = _id * 1;
    sql.remove('uqmei', 'banners', { '_id': bannerId }).then(() => {
        res.redirect('/banner');
    }).catch((err) => {
        res.redirect('/banner');
    })
});

// 更新
router.post('/updateAction', function(req, res, next) {
    console.log("updata11111111111111", req.body)
    let { bannerId, imgSrc } = req.body;
    bannerId = bannerId * 1;
    sql.update('uqmei', 'banners', 'updateOne', { '_id': bannerId }, { $set: { 'bannerSrc': imgSrc } })
        .then(() => {
            res.redirect('/banner');
        }).catch(err => {
            res.redirect('/banner');
        })
});


module.exports = router;