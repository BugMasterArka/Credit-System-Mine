const mysql = require('mysql');

exports.con = mysql.createConnection({
    host    :'localhost',
    user    :'root',
    password:'root',
    database:'credit_system'
});