var express = require('express');
var router = express.Router();
var sql = require('../../tool/sql');

//分页
router.get('/', function(req, res, next) {

    let { pageCode, pageNumber } = req.query;
    pageCode = pageCode * 1 || 1; // 默认是第一页
    pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
    sql.find('mi', 'detail', {}).then(data => {
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

// 删除
router.get('/remove', function(req, res, next) {
    let { goodsId } = req.query;
    // console.log(typeof(goodsId));
    goodsId = goodsId * 1;
    sql.remove('mi', 'detail', { goodsId }).then(() => {
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

// 商品查询
router.get('/search', (req, res, next) => {
    let { goodsId } = req.query;
    goodsId = goodsId * 1;
    sql.find('mi', 'detail', { goodsId }).then(data => {
        res.send({
            code: 200,
            message: 'success',
            data: data
        })
    })
})




module.exports = router;