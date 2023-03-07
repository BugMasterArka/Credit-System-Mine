const {con} = require('../db');

// register a retailer
exports.registerRetailer = async (retailer_id, name, phone, balance, password)=>{
    let dbOper = new Promise((resolve,reject)=>{
        let sql = `INSERT INTO retailer VALUES(?,?,?,?,?);`;
        let values = [retailer_id,name,phone,balance,password];
        con.query(sql,values,(err,result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
    return await dbOper;
};

// login a retailer
exports.loginRetailer = async (retailer_id)=>{
    let dbOper = new Promise((resolve, reject)=>{
        let sql = `SELECT retailer_id,password FROM retailer WHERE retailer_id=?;`;
        con.query(sql,retailer_id,(err,result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
    return await dbOper;
};

// fetch balance from retailer account
exports.fetchBalance = async (retailer_id)=>{
    let dbOper = new Promise((resolve,reject)=>{
        let sql = `SELECT balance FROM retailer WHERE retailer_id=?;`;
        con.query(sql,retailer_id,(err,result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
    return await dbOper;
};

// delete a retailer
exports.deleteRetailer = async (retailer_id)=>{
    let dbOper = new Promise((resolve,reject)=>{
        let sql = `DELETE FROM retailer WHERE retailer_id=?;`;
        con.query(sql,retailer_id,(err,result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
    return await dbOper;
};

// add balance to a retailer account
exports.addAmt = async (credits,retailer_id)=>{
    let dbOper = new Promise((resolve,reject)=>{
        let sql = `UPDATE retailer SET balance=balance+? WHERE retailer_id=?;`;
        let values = [credits,retailer_id];
        con.query(sql,values,(err,result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
    return await dbOper;
};