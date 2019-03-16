var express = require('express');
var router = express.Router();
var sql = require('./../../tool/sql');
var md5 = require('md5');


//分页
router.get('/', function(req, res, next) {

    // let { pageCode, pageNumber } = req.query;
    // pageCode = pageCode * 1 || 1; // 默认是第一页
    // pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
    sql.find('mi', 'users', {}).then(data => {
        // const totalNumber = Math.ceil(data.length / pageNumber);
        // const userCount = data.length;
        // data = data.splice((pageCode - 1) * pageNumber, pageNumber);

        res.send({
            code: 200,
            message: '成功',
            data: data
        })
    }).catch(err => {
        console.log(err)
    })
});

// 添加用户
router.post('/addAction', function(req, res, next) {
    let { tel, username, password } = req.body;
    tel = tel * 1;
    sql.find('mi', 'users', { tel }).then(data => {
            if (data.length == 0) {
                // 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
                password = md5(password);
                sql.insert('mi', 'users', { tel, username, password })
                    .then(() => {
                        res.send({
                            code: 200,
                            message: '成功',
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
                    message: '用户已存在',
                    data: 0
                })
            }
        }).catch(err => {
            res.send({
                code: 200,
                message: '失败',
                data: -1
            })
        })
        // console.log(obj);

});
// 删除
router.get('/remove', function(req, res, next) {
    let { tel } = req.query;
    // console.log(typeof(tel));
    tel = tel * 1;
    sql.remove('mi', 'users', { tel }).then(() => {
        res.send({
            code: 200,
            message: '成功',
            data: 1
        })
    }).catch((err) => {
        res.send({
            code: 200,
            message: '失败',
            data: 0
        })
    })
});
//删除全部removeAll
router.get('/removeAll', function(req, res, next) {
    sql.remove('mi', 'users', {}).then(() => {
        res.send({
            code: 200,
            message: '成功',
            data: 1
        })
    }).catch((err) => {
        res.send({
            code: 200,
            message: '失败',
            data: 0
        })
    })
});
// 修改姓名
router.post('/updateAction', function(req, res, next) {
    let { tel, username } = req.body;
    tel = tel * 1;
    sql.update('mi', 'users', 'updateOne', { tel }, { $set: { username } })
        .then(() => {
            res.send({
                code: 200,
                message: '成功',
                data: 1
            })
        }).catch(err => {
            res.send({
                code: 200,
                message: '失败',
                data: 0
            })
        })
});
// 修改密码
router.post('/updateActionPassword', function(req, res, next) {
    let { tel, password } = req.body;
    tel = tel * 1;
    password = md5(password);
    sql.update('mi', 'users', 'updateOne', { tel }, { $set: { password } })
        .then(() => {
            res.send({
                code: 200,
                message: '成功',
                data: 1
            })
        }).catch(err => {
            res.send({
                code: 200,
                message: '失败',
                data: 0
            })
        })
});

// 登录注册查询功能
router.post('/search', (req, res, next) => {
    let { tel, password } = req.body;
    tel = tel * 1;
    password = md5(password);
    sql.find('mi', 'users', { tel }).then(data => {
        // console.log(data[0])
        if (data.length === 0) {
            res.send({
                code: 200,
                message: '没有该手机号',
                data: -1
            })
        } else {
            if (data[0].password === password) {
                res.send({
                    code: 200,
                    message: '登录成功',
                    data: 1
                })
            } else {
                res.send({
                    code: 200,
                    message: '密码错误',
                    data: 0
                })
            }
        }

    })
})

//搜索用户
router.get('/searchuser', function(req, res, next) {
    let { tel } = req.query;
    tel = tel * 1;
    sql.find('mi', 'users', { tel }).then((data) => {
        res.send({
            code: 200,
            message: '成功',
            data: data
        })
    }).catch((err) => {
        res.send({
            code: 200,
            message: '失败',
            data: 0
        })
    })
});

module.exports = router;