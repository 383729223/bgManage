var xlsx = require('node-xlsx');
var nodeExcel = require('excel-export');

const productfilemd = {
    // 导入excel文件
    analysisdata(path) {
        return new Promise((resolve, reject) => {
            // 解析excel文件
            const obj = xlsx.parse(path);
            resolve(obj); // obj为buffer类型
        })
    },
    usersfilterdata(data) {
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
        return arr;
    },
    // 导出excel文件
    exportdata(_headers, rows) {
        var conf = {};
        conf.name = "mysheet";
        conf.cols = [];
        for (var i = 0; i < _headers.length; i++) {
            var col = {};
            col.caption = _headers[i].caption;
            col.type = _headers[i].type;
            conf.cols.push(col);
        }
        conf.rows = rows;
        var result = nodeExcel.execute(conf);
        return result;

    }
}

module.exports = productfilemd;