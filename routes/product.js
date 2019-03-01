var express = require('express');
var router = express.Router();
var sql = require('./../tool/sql');
var fildmd = require('./../tool/productfile');

router.get('/', function(req, res, next) {
    if (req.session.isLogin != 1) { // 表示未登录
        res.redirect('/login'); // 跳转到登录页面
        return; // 代码将不再继续往下执行
    }
    let { pageCode, pageNumber } = req.query;
    pageCode = pageCode * 1 || 1; // 默认是第一页
    pageNumber = pageNumber * 1 || 8; // 默认每页显示8条数据
    sql.find('uqmei', 'product', {}).then(data => {
        const totalNumber = Math.ceil(data.length / pageNumber);
        const productCount = data.length;
        data = data.splice((pageCode - 1) * pageNumber, pageNumber);
        // console.log(data)
        res.render('product', {
            activeIndex: 3,
            totalNumber,
            pageNumber,
            pageCode,
            productCount,
            data //  < == > data: data
        });
    }).catch(err => {
        console.log(err)
    })
});

router.get('/login', function(req, res, next) {
    res.render('login');
});

//增加一条新的商品数据
router.get('/add', function(req, res, next) {
    res.render('product_add', {
        activeIndex: 3
    });
});
router.post('/addAction', function(req, res, next) {
    // { tel: tel}    { tel }
    // post 如何拿数据
    // const obj = req.body;
    let { _id, big_pic, title, prov_city, discount_price, original_price, count, buyCount, flag } = req.body;
    if (_id != "" && big_pic != "" && title != "" && prov_city != "" && discount_price != "" && original_price != "" && count != "" && buyCount != "" && flag != "") {
        sql.find('uqmei', 'product', { _id: _id }).then(data => {
                if (data.length == 0) {
                    // 表示没有查询到数据 --- 可以添加该用户 -- 先加密  -- 后添加
                    // password = md5(password);
                    sql.insert('uqmei', 'product', { _id, big_pic, title, prov_city, discount_price, original_price, count, buyCount, flag })
                        .then(() => {
                            res.redirect('/product');
                        })
                        .catch((err) => {
                            res.redirect('/product/add');
                        })
                } else {
                    // 该产品已存在
                    res.redirect('/product/add');
                }
            }).catch(err => {
                // console.log(err)
                res.redirect('/product/add');
            })
            // console.log(obj);
    } else {
        res.redirect('/product');
    }
});
// 删除
router.get('/remove', function(req, res, next) {
    const { _id } = req.query;
    sql.remove('uqmei', 'product', { _id }).then(() => {
        res.redirect('/product');
    }).catch((err) => {
        res.redirect('/product');
    })
});
//删除全部removeAll
router.get('/removeAll', function(req, res, next) {
    // const { _id } = req.query;
    sql.remove('uqmei', 'product', {}).then(() => {
        res.redirect('/product');
    }).catch((err) => {
        res.redirect('/product');
    })
});
// 更新
router.post('/updateAction', function(req, res, next) {
    let { _id, username, pageCode } = req.body;
    _id = _id * 1;
    sql.update('uqmei', 'product', 'updateOne', { _id }, { $set: { big_pic, title, prov_city, discount_price, original_price, count, buyCount, flag } })
        .then(() => {
            res.redirect('/product?pageCode=' + pageCode);
        }).catch(err => {
            res.redirect('/product');
        })
});



//导入文件
// 服务器导入
// const xlsx = "/usr/local/node-pro/bgAdmin/products.xlsx";
//本地导入
const xlsx = "G:/nodeProject/bgAdmin/products.xlsx";
router.get('/importProduct', (req, res, next) => {
    fildmd.analysisdata(xlsx).then(obj => {
        // console.log(obj)
        const data = obj[0].data;
        let arr = [];
        data.map((item, index) => {
                if (index !== 0) {
                    arr.push({
                        _id: item[0],
                        title: item[1],
                        big_pic: item[2],
                        discount_price: item[3],
                        original_price: item[4],
                        prov_city: item[5],
                        count: item[6],
                        buyCount: item[7],
                        flag: item[8]
                    })
                }
            })
            // res.send(result)
        sql.insert('uqmei', 'product', arr).then(() => {
            res.redirect('/product')
        })
    })
})

// 导出
router.get('/exportProduct', (req, res, next) => {

    const _headers = [
        { caption: '_id', type: 'string' },
        { caption: 'title', type: 'string' },
        { caption: 'big_pic', type: 'string' },
        { caption: 'discount_price', type: 'string' },
        { caption: 'original_price', type: 'string' },
        { caption: 'prov_city', type: 'string' },
        { caption: 'count', type: 'string' },
        { caption: 'buyCount', type: 'string' },
        { caption: 'flag', type: 'string' }
    ];

    sql.find('uqmei', 'product', {}).then(data => {
        let alldata = new Array();
        data.map((item, index) => {
            let arr = [];
            arr.push(item._id);
            arr.push(item.title);
            arr.push(item.big_pic);
            arr.push(item.discount_price);
            arr.push(item.original_price);
            arr.push(item.prov_city);
            arr.push(item.count);
            arr.push(item.buyCount);
            arr.push(item.flag);
            alldata.push(arr);
        })
        const result = filemd.exportdata(_headers, alldata);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader("Content-Disposition", "attachment; filename=" + "products.xlsx");
        res.end(result, 'binary');
    })
})

//模糊查询
router.get('/search', (req, res, next) => {
    const { title } = req.query;
    sql.find('uqmei', 'product', { title: eval('/' + title + '/') }).then(data => {
        // res.send(data)
        let productCount = data.length;
        sql.distinct('uqmei', 'product', 'original_price').then(priceArr => {
            res.render('product', {
                activeIndex: 3,
                totalNumber: 1,
                pageCode: 1,
                data,
                pageNumber: data.length,
                priceArr,
                productCount
            })
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
        let productCount = data.length;

        sql.distinct('uqmei', 'product', 'original_price').then(priceArr => {
            console.log(priceArr)
            res.render('product', {
                activeIndex: 3,
                totalNumber: 1,
                pageCode: 1,
                data,
                pageNumber: data.length,
                priceArr,
                productCount
            })
        })

    })
})


module.exports = router;