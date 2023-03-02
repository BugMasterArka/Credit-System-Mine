const {con} = require('../db');

// check if a student with a registration number exists
exports.findStudent = async (regn_no)=>{
    let dbOper = new Promise((resolve,reject)=>{
        let sql = `SELECT regn_no,name,serial_id,password FROM student WHERE regn_no='${regn_no}'`;
        con.query(sql,(err,result)=>{
            if(err) reject(err);
            if(result.length!=0){console.log('Value Found!');}
            console.log(result);
            resolve(result);
        });
    });
    return await dbOper;
}

// save details of a student to the table
exports.saveStudent = async (regn_no,name,wallet_id,balance,phone,password,pin,serial_id)=>{
    console.log(wallet_id.length);
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
}