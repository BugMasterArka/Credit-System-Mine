const {con} = require('../db');
const studop = require('../operations/studentOperations');
const retop = require('../operations/retailerOperations');

exports.Transact = async (regn_no,retailer_id,credits)=>{
    let deduce = studop.deductAmt(credits,regn_no);
    deduce.then((value1) => {
        if(value1==true){
            let added = retop.addAmt(credits,retailer_id);
            added.then((value2)=>{
                if(value2==true){
                    let transaction_id = unid({
                        length: 15,
                        useNumbers: true,
                        useLetters: true,
                        includeSymbols: ["#"],
                    });
                    let dbOper = new Promise((resolve, reject)=>{
                        let sql = `INSERT INTO transactions VALUES (?,?,?,?);`;
                        let values = [transaction_id,retailer_id,regn_no,credits];
                        con.query(sql,values,(err,result)=>{
                            if(err){
                                let deducted = retop.deductAmtRollback(credits,retailer_id);
                                if(deducted==true){
                                    let addited = studop.addCreditsRollback(regn_no,credits);
                                    if(addited==true){
                                        console.log("Rollback successful");
                                        resolve(false);
                                    }
                                }
                            }else{
                                resolve(true);
                            }
                        });
                    });
                    return dbOper;
                }else{
                    let HalfRollAddStudent = studop.addCreditsRollback(regn_no,credits);
                    if(HalfRollAddStudent){
                        return false;
                    }
                }
            });
        }else{
            return false;
        }
    });
}