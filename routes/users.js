var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var md5 = require('md5');
// var xlsx = require('node-xlsx');
var filemd = require('../tool/userfile.js');

/* GET users listing. */
// router.get('/', function(req, res, next) {
// 	sql.find('uqmei', 'users', {}).then(data => {
// 		res.render('users', { 
// 			activeIndex: 2,
// 			data    //  < == > data: data
// 		});
// 	}).catch(err => {
// 		console.log(err)
// 	})
// });

//分页
router.get('/', function(req, res, next) {
    if (req.session.isLogin != 1) { // 表示未登录
        res.redirect('/login'); // 跳转到登录页面
        return; // 代码将不再继续往下执行
    }
    let { pageCode, pageNumber } = req.query;
    pageCode = pageCode * 1 || 1; // 默认是第一页
    pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
    sql.find('uqmei', 'users', {}).then(data => {
        const totalNumber = Math.ceil(data.length / pageNumber);
        const userCount = data.length;
        data = data.splice((pageCode - 1) * pageNumber, pageNumber);
        sql.distinct('uqmei', 'users', 'age').then(ageArr => {
            res.render('users', {
                activeIndex: 2,
                totalNumber,
                pageNumber,
                pageCode,
                data,
                ageArr,
                userCount
            });
        })
    }).catch(err => {
        console.log(err)
    })
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

router.get('/add', function(req, res, next) {
    res.render('users_add', {
        activeIndex: 2
    });
});
router.post('/addAction', function(req, res, next) {
    // { tel: tel}    { tel }
    // post 如何拿数据
    // const obj = req.body;
    let { tel, username, password } = req.body;
    sql.find('uqmei', 'users', { tel: tel }).then(data => {
            if (data.length == 0) {
                // 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
                password = md5(password);
                sql.insert('uqmei', 'users', { tel, username, password, age })
                    .then(() => {
                        res.redirect('/users');
                    })
                    .catch((err) => {
                        res.redirect('/users/add');
                    })
            } else {
                // 该用户已存在
                res.redirect('/users/add');
            }
        }).catch(err => {
            console.log(err)
            res.redirect('/users/add');
        })
        // console.log(obj);

});
// 删除
router.get('/remove', function(req, res, next) {
    const { tel } = req.query;
    sql.remove('uqmei', 'users', { tel }).then(() => {
        res.redirect('/users');
    }).catch((err) => {
        res.redirect('/users');
    })
});
//删除全部removeAll
router.get('/removeAll', function(req, res, next) {
    sql.remove('uqmei', 'users', {}).then(() => {
        res.redirect('/users');
    }).catch((err) => {
        res.redirect('/users');
    })
});
// 更新
router.post('/updateAction', function(req, res, next) {
    let { tel, username, pageCode } = req.body;
    tel = tel * 1;
    sql.update('uqmei', 'users', 'updateOne', { tel }, { $set: { username } })
        .then(() => {
            res.redirect('/users?pageCode=' + pageCode);
        }).catch(err => {
            res.redirect('/users');
        })
});

//导入用户
const usersxlsx = "/usr/local/node-pro/bgAdmin/user-lists.xlsx";

router.get('/importUsers', (req, res, next) => {
        filemd.analysisdata(usersxlsx).then(obj => {
            // console.log(obj)
            const data = obj[0].data;
            const result = filemd.usersfilterdata(data)
                // res.send(result)
            sql.insert('uqmei', 'users', result).then(() => {
                res.redirect('/users')
            })
        })
    })
    // 导出用户
router.get('/exportUsers', (req, res, next) => {
    const _headers = [
        { caption: 'tel', type: 'string' },
        { caption: 'username', type: 'string' },
        { caption: 'password', type: 'string' },
        { caption: 'age', type: 'string' }
    ];

    sql.find('uqmei', 'users', {}).then(data => {
        let alldata = new Array();
        data.map((item, index) => {
            let arr = [];
            arr.push(item.tel);
            arr.push(item.username);
            arr.push(item.password);
            arr.push(item.age);
            alldata.push(arr);
        })
        const result = filemd.exportdata(_headers, alldata);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "user-lists.xlsx");
        res.end(result, 'binary');
    })

})

//模糊查询
router.get('/search', (req, res, next) => {
    const { username } = req.query;
    sql.find('uqmei', 'users', { username: eval('/' + username + '/') }).then(data => {
        // res.send(data)
        const userCount = data.length;

        sql.distinct('uqmei', 'users', 'age').then(ageArr => {
            res.render('users', {
                activeIndex: 2,
                totalNumber: 1,
                pageCode: 1,
                data,
                pageNumber: data.length,
                ageArr,
                userCount
            })
        })

    })
})

//年龄查询
router.get('/ageSearch', (req, res, next) => {
    let { age } = req.query;
    age *= 1;
    sql.find('uqmei', 'users', { age }).then(data => {
        // res.send(data)
        const userCount = data.length;
        sql.distinct('uqmei', 'users', 'age').then(ageArr => {
            res.render('users', {
                activeIndex: 2,
                totalNumber: 1,
                pageCode: 1,
                data,
                pageNumber: data.length,
                ageArr,
                userCount
            })
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
        const userCount = data.length;

        sql.distinct('uqmei', 'users', 'age').then(ageArr => {
            res.render('users', {
                activeIndex: 2,
                totalNumber: 1,
                pageCode: 1,
                data,
                pageNumber: data.length,
                ageArr,
                userCount
            })
        })

    })
})



module.exports = router;