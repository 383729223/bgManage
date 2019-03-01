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
    const { tel } = req.query;
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
// 更新
router.post('/updateAction', function(req, res, next) {
    let { tel, username, pageCode } = req.body;
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

//模糊查询
router.get('/search', (req, res, next) => {
    const { username } = req.query;
    sql.find('mi', 'users', { username: eval('/' + username + '/') }).then(data => {
        res.send({
            code: 200,
            message: '成功',
            data: data
        })

    })
})




module.exports = router;