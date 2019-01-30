var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var md5 = require('md5');


/* GET home page. */

// session登录验证-----------------------------------------------------------------------------------------
router.get('/', function(req, res, next) {
    if (req.session.isLogin != 1) { // 表示未登录
        res.redirect('/login'); // 跳转到登录页面
        return; // 代码将不再继续往下执行
    }
    res.render('index', {
        activeIndex: 1
    });
});
router.post('/loginAction', function(req, res, next) {
    let { username, password } = req.body;
    password = md5(password);
    sql.find('uqmei', 'supervisor', { username, password }).then(data => {
        if (data.length === 0) {
            req.session.isLogin = 0; // 未登录
            res.redirect('/login')
        } else {
            req.session.isLogin = 1; // 已登录
            res.redirect('/')
        }
    })
});
router.get('/logout', (req, res, next) => {
        // req.session.isLogin = 0;
        req.session.isLogin = null;
        res.redirect('/login')
    })
    // session登录验证 --- END ---------------------------------------------------------------------------------------



// cookie登录验证----------------------------------------------------------------------------------------------------
// router.get('/', function(req, res, next) {
//     if (!req.cookies.isLogin || req.cookies.isLogin == 0) { // 表示未登录
//         res.redirect('/login'); // 跳转到登录页面
//         return; // 代码将不再继续往下执行
//     }
//     res.render('index', {
//         activeIndex: 1
//     });
// });

// router.post('/loginAction', (req, res, next) => {
//     let { username, password } = req.body;
//     password = md5(password);
//     sql.find('uqmei', 'supervisor', { username, password }).then(data => {
//         if (data.length === 0) {
//             res.cookie('isLogin', 0);
//             res.redirect('/login')
//         } else {
//             res.cookie('isLogin', 1);
//             res.redirect('/')
//         }
//     })
// })
// router.get('/logout', (req, res, next) => {
//         // res.cookie('isLogin', 0); // 覆盖
//         res.clearCookie('isLogin') // 删除cookie
//         res.redirect('/login')
//     })
// cookie登录验证----  END  --------------------------------------------------------------------------------------------------



router.get('/login', function(req, res, next) {
    res.render('login');
});


module.exports = router;