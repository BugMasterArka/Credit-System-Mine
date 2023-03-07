const {con} = require('../db');

// check if a student with a registration number exists
// only to check if any record exists
exports.findStudentReg = async (regn_no)=>{
    let dbOper = new Promise((resolve,reject)=>{
        let sql = `SELECT regn_no FROM student WHERE regn_no='${regn_no}'`;
        con.query(sql,(err,result)=>{
            if(err) reject(err);
            if(result.length!=0){console.log('Value Found!');}
            // console.log(result);
            resolve(result);
        });
    });
    return await dbOper;
};

// find a student for student login
// only reegnoo and password needed
exports.findStudentLog = async (regn_no)=>{
    let dbOper = new Promise((resolve,reject)=>{
        let sql = `SELECT regn_no,serial_id,password FROM student WHERE regn_no='${regn_no}'`;
        con.query(sql,(err,result)=>{
            if(err) reject(err);
            if(result.length!=0){console.log('Value Found!');}
            // console.log(result);
            resolve(result);
        });
    });
    return await dbOper;
};

// save details of a student to the table
exports.saveStudent = async (regn_no,name,wallet_id,balance,phone,password,pin,serial_id)=>{
    let dbOper = new Promise((resolve,reject)=>{
        let sql = `INSERT INTO student VALUES(?,?,?,?,?,?,?,?);`;
        let values = [regn_no,name,wallet_id,balance,phone,password,pin,serial_id];
        con.query(sql,values,(err,result)=>{
            if(err) reject(err);
            console.log('Student Values Inserted');
            // let student = this.findStudent(regn_no);
            resolve(result);
        });
    });
    return await dbOper;
};

// add credits to student account
exports.addCredits = async (regn_no,serial_id,credits)=>{
    let dbOper = new Promise((resolve,reject)=>{
        let sql = `UPDATE student SET balance=balance+? WHERE regn_no=? AND serial_id=?;`;
        let values = [credits,regn_no,serial_id];
        con.query(sql,values,(err,result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
    return await dbOper;
};

// fetch the balance in a students account
exports.fetchBalance = async (serial_id)=>{
    let dbOper = new Promise((resolve, reject)=>{
        let sql = `SELECT balance FROM student WHERE serial_id=?`;
        con.query(sql,serial_id,(err,result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
    return await dbOper;
};

// authenticate user before fetching balance
exports.fetchBalanceAuth = async (regn_no)=>{
    let dbOper = new Promise((resolve,reject)=>{
        let sql = `SELECT regn_no,serial_id FROM student WHERE regn_no=?`;
        con.query(sql,regn_no,(err,result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
    return await dbOper;
};

// deduct amount from student account
exports.deductAmt = async (credits,regn_no)=>{
    let dbOper = new Promise((resolve,reject)=>{
        let sql = `UPDATE student SET balance=balance-? WHERE regn_no=?`;
        let values = [credits,regn_no];
        con.query(sql,values,(err,result)=>{
            if(err) reject(err);
            resolve(result);
        });
    });
    return await dbOper;
};