var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var fildmd = require('./../tool/productfile');

router.get('/', function(req, res, next) {

    let { pageCode, pageNumber } = req.query;
    pageCode = pageCode * 1 || 1; // 默认是第一页
    pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
    sql.find('uqmei', 'product', {}).then(data => {
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
            message: 'success',
            data: data
        })
    }).catch(err => {
        console.log(err)
    })
});

//增加一条新的商品数据

router.post('/addAction', function(req, res, next) {
    let { _id, big_pic, title, prov_city, discount_price, original_price, count } = req.body;
    sql.find('uqmei', 'product', { _id: _id }).then(data => {
            if (data.length == 0) {
                // 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
                // password = md5(password);
                sql.insert('uqmei', 'product', { _id, big_pic, title, prov_city, discount_price, original_price, count })
                    .then(() => {
                        res.send({
                            code: 200,
                            message: 'success',
                            data: 1
                        })
                    })
                    .catch((err) => {
                        res.redirect('/product/add');
                    })
            } else {
                // 该产品已存在
                res.send({
                    code: 200,
                    message: 'success',
                    data: 0
                })
            }
        }).catch(err => {
            // console.log(err)
            res.send({
                code: 200,
                message: 'success',
                data: -1
            })
        })
        // console.log(obj);

});
// 删除
router.get('/remove', function(req, res, next) {
    const { _id } = req.query;
    sql.remove('uqmei', 'product', { _id }).then(() => {
        res.send({
            code: 200,
            message: 'success',
            data: 1
        })
    }).catch((err) => {
        res.send({
            code: 200,
            message: 'success',
            data: 0
        })
    })
});
//删除全部removeAll
router.get('/removeAll', function(req, res, next) {
    sql.remove('uqmei', 'product', {}).then(() => {
        res.send({
            code: 200,
            message: 'success',
            data: 1
        })
    }).catch((err) => {
        res.send({
            code: 200,
            message: 'success',
            data: 0
        })
    })
});
// 更新
router.post('/updateAction', function(req, res, next) {
    let { _id, username, pageCode } = req.body;
    _id = _id * 1;
    sql.update('uqmei', 'product', 'updateOne', { _id }, { $set: { big_pic, title, prov_city, discount_price, original_price, count } })
        .then(() => {
            res.send({
                code: 200,
                message: 'success',
                data: 1
            })
        }).catch(err => {
            res.send({
                code: 200,
                message: 'success',
                data: 0
            })
        })
});



//模糊查询
router.get('/search', (req, res, next) => {
    const { title } = req.query;
    sql.find('uqmei', 'product', { title: eval('/' + title + '/') }).then(data => {
        // res.send(data)
        // let productCount = data.length;
        // sql.distinct('uqmei', 'product', 'original_price').then(priceArr => {
        //     res.render('product', {
        //         activeIndex: 3,
        //         totalNumber: 1,
        //         pageCode: 1,
        //         data,
        //         pageNumber: data.length,
        //         priceArr,
        //         productCount
        //     })
        // })
        res.send({
            code: 200,
            message: 'success',
            data: data
        })

    })
})

// 排序
router.get('/sort', (req, res, next) => {
    let { type, num } = req.query;
    let sortData = {};
    sortData[type] = num * 1;
    sql.sort('uqmei', 'product', sortData).then(data => {
        // res.send(data)
        // let productCount = data.length;
        // sql.distinct('uqmei', 'product', 'original_price').then(priceArr => {
        //     console.log(priceArr)
        //     res.render('product', {
        //         activeIndex: 3,
        //         totalNumber: 1,
        //         pageCode: 1,
        //         data,
        //         pageNumber: data.length,
        //         priceArr,
        //         productCount
        //     })
        // })
        res.send({
            code: 200,
            message: 'success',
            data: data
        })

    })
})


module.exports = router;