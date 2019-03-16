var express = require('express');
var router = express.Router();
var sql = require('../../tool/sql');

//分页
router.get('/', function(req, res, next) {

    let { pageCode, pageNumber } = req.query;
    pageCode = pageCode * 1 || 1; // 默认是第一页
    pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
    sql.find('mi', 'product', {}).then(data => {
        data = data.splice((pageCode - 1) * pageNumber, pageNumber);

        res.send({
            code: 200,
            message: '成功',
            data: data
        })
    }).catch(err => {
        console.log(err)
    })
});

// 添加商品
router.post('/addAction', function(req, res, next) {
    let { title, imgsrc, goodsId, price, sale, dir, type } = req.body;
    goodsId = goodsId * 1;
    sql.find('mi', 'product', { goodsId }).then(data => {
            if (data.length == 0) {
                // 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
                sql.insert('mi', 'product', { title, imgsrc, goodsId, price, sale, dir, type })
                    .then(() => {
                        res.send({
                            code: 200,
                            message: '添加成功',
                            data: 1
                        })
                    })
                    .catch((err) => {
                        res.redirect('/product/add');
                    })
            } else {
                // 该用户已存在
                res.send({
                    code: 200,
                    message: '该商品存在',
                    data: 0
                })
            }
        }).catch(err => {
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
    let { goodsId } = req.query;
    // console.log(typeof(goodsId));
    goodsId = goodsId * 1;
    sql.remove('mi', 'product', { goodsId }).then(() => {
        res.send({
            code: 200,
            message: '删除成功',
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

// 更新
router.post('/updateAction', function(req, res, next) {
    let { title, imgsrc, goodsId, price, sale, dir, type } = req.body;
    goodsId = goodsId * 1;
    sql.update('mi', 'product', 'updateOne', { goodsId }, { $set: { title, imgsrc, price, sale, dir, type } })
        .then(() => {
            res.send({
                code: 200,
                message: '更新成功',
                data: 1
            })
        }).catch(err => {
            res.send({
                code: 200,
                message: '更新失败',
                data: 0
            })
        })
});

// 商品名称模糊查询
router.get('/search', (req, res, next) => {
    const { title } = req.query;
    sql.find('mi', 'product', { title: eval('/' + title + '/') }).then(data => {
        res.send({
            code: 200,
            message: 'success',
            data: data
        })
    })
})

// 根据商品品类查询
router.get('/searchType', (req, res, next) => {
    const { type } = req.query;
    sql.find('mi', 'product', { type }).then(data => {
        res.send({
            code: 200,
            message: 'success',
            data: data
        })
    })
})

// 商品ID查询
router.get('/searchId', (req, res, next) => {
    let { goodsId } = req.query;
    goodsId = goodsId * 1;
    sql.find('mi', 'product', { goodsId }).then(data => {
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
    sql.sort('mi', 'product', sortData).then(data => {
        res.send({
            code: 200,
            message: 'success',
            data: data
        })

    })
})


// 列出所有类型分布
router.get('/distinct', (req, res, next) => {
    sql.distinct('mi', 'product', 'type').then(data => {
        res.send({
            code: 200,
            message: 'success',
            data: data
        })
    })
})

module.exports = router;