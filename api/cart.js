var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var fildmd = require('./../tool/productfile');

router.get('/', function(req, res, next) {

    let { pageCode, pageNumber } = req.query;
    pageCode = pageCode * 1 || 1; // 默认是第一页
    pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
    sql.find('uqmei', 'cartLists', {}).then(data => {
        const totalNumber = Math.ceil(data.length / pageNumber);
        const productCount = data.length;
        data = data.splice((pageCode - 1) * pageNumber, pageNumber);
        // console.log(data)
        // res.render('product', {
        //     activeIndex: 3,
        //     totalNumber,
        //     pageNumber,
        //     pageCode,
        //     productCount,
        //     data //  < == > data: data
        // });
        res.send({
            code: 200,
            message: '获取购物车信息成功',
            data: data
        })
    }).catch(err => {
        // console.log(err)
        res.send({
            code: 200,
            message: '获取购物车信息失败',
            data: 0
        })
    })
});

//增加一条新的商品数据

router.post('/addAction', function(req, res, next) {
    let { goodsId, big_pic, title, discount_price, buyCount, flag } = req.body;
    goodsId = goodsId * 1;
    sql.find('uqmei', 'cartLists', { goodsId }).then(data => {
            // res.send(data)
            if (data.length === 0) {
                // 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
                // password = md5(password);
                sql.insert('uqmei', 'cartLists', { goodsId, big_pic, title, discount_price, buyCount, flag })
                    .then(() => {
                        res.send({
                            code: 200,
                            message: '添加成功',
                            data: 1
                        })
                    })
                    .catch((err) => {
                        // res.redirect('/product/add');

                    })
            } else {
                // 该产品已存在
                res.send({
                    code: 200,
                    message: '购物车该产品已存在',
                    data: 0
                })
            }
        }).catch(err => {
            // console.log(err)
            res.send({
                code: 200,
                message: '添加失败',
                data: -1
            })
        })
        // console.log(obj);

});
// 删除
router.get('/remove', function(req, res, next) {
    const { goodsId } = req.query;
    sql.remove('uqmei', 'cartLists', { goodsId }).then(() => {
        res.send({
            code: 200,
            message: '删除单个成功',
            data: 1
        })
    }).catch((err) => {
        res.send({
            code: 200,
            message: '删除失败',
            data: 0
        })
    })
});
//删除全部removeAll
router.get('/removeAll', function(req, res, next) {
    sql.remove('uqmei', 'cartLists', {}).then(() => {
        res.send({
            code: 200,
            message: '清空成功',
            data: 1
        })
    }).catch((err) => {
        res.send({
            code: 200,
            message: '清空失败',
            data: 0
        })
    })
});
// 更新
router.post('/updateAction', function(req, res, next) {
    let { goodsId } = req.body;
    goodsId = goodsId * 1;
    sql.update('uqmei', 'cartLists', 'updateOne', { goodsId }, { $set: { big_pic, title, discount_price, buyCount, flag } })
        .then(() => {
            res.send({
                code: 200,
                message: '商品更新成功',
                data: 1
            })
        }).catch(err => {
            res.send({
                code: 200,
                message: '商品更新失败',
                data: 0
            })
        })
});

// 排序
router.get('/sort', (req, res, next) => {
    let { type, num } = req.query;
    let sortData = {};
    sortData[type] = num * 1;
    sql.sort('uqmei', 'cartLists', sortData).then(data => {
        res.send({
            code: 200,
            message: 'success',
            data: data
        })

    })
})


module.exports = router;