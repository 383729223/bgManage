var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var md5 = require('md5');
var filemd = require('../tool/userfile.js');


//分页
router.get('/', function(req, res, next) {

    let { pageCode, pageNumber } = req.query;
    pageCode = pageCode * 1 || 1; // 默认是第一页
    pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
    sql.find('uqmei', 'users', {}).then(data => {
        const totalNumber = Math.ceil(data.length / pageNumber);
        const userCount = data.length;
        data = data.splice((pageCode - 1) * pageNumber, pageNumber);

        res.send({
            code: 200,
            message: 'success',
            data: data
        })
    }).catch(err => {
        console.log(err)
    })
});



router.post('/addAction', function(req, res, next) {
    let { tel, username, password } = req.body;
    sql.find('uqmei', 'users', { tel: tel }).then(data => {
            if (data.length == 0) {
                // 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
                password = md5(password);
                sql.insert('uqmei', 'users', { tel, username, password, age })
                    .then(() => {
                        res.send({
                            code: 200,
                            message: 'success',
                            data: 1
                        })
                    })
                    .catch((err) => {
                        res.redirect('/users/add');
                    })
            } else {
                // 该用户已存在
                res.send({
                    code: 200,
                    message: 'success',
                    data: 0
                })
            }
        }).catch(err => {
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
    const { tel } = req.query;
    sql.remove('uqmei', 'users', { tel }).then(() => {
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
    sql.remove('uqmei', 'users', {}).then(() => {
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
    let { tel, username, pageCode } = req.body;
    tel = tel * 1;
    sql.update('uqmei', 'users', 'updateOne', { tel }, { $set: { username } })
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
    const { username } = req.query;
    sql.find('uqmei', 'users', { username: eval('/' + username + '/') }).then(data => {
        res.send({
            code: 200,
            message: 'success',
            data: data
        })

    })
})

//年龄查询
router.get('/ageSearch', (req, res, next) => {
    let { age } = req.query;
    age *= 1;
    sql.find('uqmei', 'users', { age }).then(data => {
        // res.send(data)
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
    sql.sort('uqmei', 'users', sortData).then(data => {
        // res.send(data)
        res.send({
            code: 200,
            message: 'success',
            data: data
        })

    })
})

// 列出所有年龄分布
router.get('/distinct', (req, res, next) => {
    sql.distinct('uqmei', 'users', 'age').then(ageArr => {
        res.send(ageArr)
    })
})


module.exports = router;