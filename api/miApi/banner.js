var express = require('express');
var router = express.Router();
var sql = require('./../../tool/sql');

/* GET users listing. */
router.get('/', function(req, res, next) {

    sql.find('mi', 'banner', {}).then(data => {
        // console.log("111111111", data)
        // res.render('banner', {
        //     activeIndex: 5,
        //     data
        // });
        res.send({
            code: 200,
            message: '成功',
            data: data
        })
    }).catch(err => {
        // console.log(err)
        res.send({
            code: 200,
            message: '获取失败',
            data: 0
        })
    })

});


//增加一条新的轮播图
// router.get('/add', function(req, res, next) {
//     res.render('banner_add', {
//         activeIndex: 5
//     });
// });

router.post('/addAction', function(req, res, next) {
    // console.log('99999999999999999', req.body)
    let { _id, imgSrc } = req.body;
    if (imgSrc != "" && _id != "") {

        _id = _id * 1;
        sql.find('mi', 'banner', { _id }).then(data => {
                // console.log('5555555555555', data)
                if (data.length === 0) {
                    // 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
                    sql.insert('mi', 'banner', { _id, imgSrc })
                        .then(() => {
                            // res.redirect('/banner');
                            res.send({
                                code: 200,
                                message: '成功',
                                data: 1
                            })
                        })
                        .catch((err) => {
                            // res.redirect('/banner/add');
                            console.log(err)

                        })
                } else {
                    // 该产品已存在
                    // res.redirect('/banner/add');
                    res.send({
                        code: 200,
                        message: '该图已存在',
                        data: 0
                    })
                }
            }).catch(err => {
                // console.log(err)
                // res.redirect('/banner/add');
                res.send({
                    code: 200,
                    message: '失败',
                    data: -1
                })
            })
            // console.log(obj);
    } else {
        res.redirect('/banner');
    }

});
// 删除
router.get('/remove', function(req, res, next) {
    let { _id } = req.query;
    _id = _id * 1;
    sql.remove('mi', 'banner', { _id }).then(() => {
        // res.redirect('/banner');
        res.send({
            code: 200,
            message: '删除成功',
            data: 1
        })
    }).catch((err) => {
        // res.redirect('/banner');
        res.send({
            code: 200,
            message: '删除失败',
            data: 0
        })
    })
});

// 更新
router.post('/updateAction', function(req, res, next) {
    // console.log("updata11111111111111", req.body)
    let { _id, imgSrc } = req.body;
    _id = _id * 1;
    sql.update('mi', 'banner', 'updateOne', { _id }, { $set: { imgSrc } })
        .then(() => {
            // res.redirect('/banner');
            res.send({
                code: 200,
                message: '更新成功',
                data: 1
            })
        }).catch(err => {
            // res.redirect('/banner');
            res.send({
                code: 200,
                message: '更新失败',
                data: 0
            })
        })
});


module.exports = router;