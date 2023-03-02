const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const studop = require('../operations/studentOperations');
const unid = require('generate-unique-id');
const bcrypt = require('bcryptjs');
const fetchuser = require('../middlewares/fetchuser');

const  JWT_SECRET = 'mYJWT$ECrEt';

// add a student
// using POST "/api/student/addstudent"
// no login required
router.post('/addstudent',[
    body('regn_no').exists().isLength({min: 9,max: 9}),
    body('name').exists().isLength({min: 3}),
    body('phone').isLength({min: 10,max: 11}),
    body('password').exists().isLength({min: 5}),
    body('pin').exists().isLength({min: 6,max: 6})
],async (req,res)=>{

    // if errors are there return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        const {regn_no,name,phone,password,pin}=req.body;
        // const student = studop.findStudent(regn_no);
        const student = await studop.findStudent(regn_no);
        // student.then((value)=>{

        // });
        console.log(student.length)
        if(student.length!=0){
            return res.status(400).json({status:"Unable",message:"A student with this ID already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(password, salt);
        const secPin = await bcrypt.hash(pin,salt);

        const wallet_id = unid({length: 10,useLetters: true, useNumbers: true, includeSymbols: ['@','#','$','&']});
        const secWallet = await bcrypt.hash(wallet_id,salt);

        const serial_id = unid({length: 15,useNumbers: true, useLetters: true,includeSymbols:['@','#','%','*']});
        const balance = 0.00;

        const savedStudent = await studop.saveStudent(regn_no,name,secWallet,balance,phone,secPass,secPin,serial_id);

        console.log(savedStudent);
        let data = {
            user:{
                serial_id:serial_id
            }
        };
        // savedStudent[0].serial_id

        const authToken = jwt.sign(data,JWT_SECRET);

        res.json({authToken});
    }catch(error){
        console.error(error.message);
        res.status(500).send("internal server error");
    }
});

// login for a student
// using POST "/api/student/login"
// no login reqd
router.post('/login',[
    body('regn_no').exists().isLength({min: 9, max: 9}),
    body('password').exists()
    ],async (req,res)=>{
        // if errors are there return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try{
            const {regn_no,password} = req.body;

            const student = await studop.findStudent(regn_no);
            if(student.length==0){
                return res.status(400).json({error: "Invalid Credentials"});
            }
            const passwordCompare = await bcrypt.compare(password,student[0].password);
            if(!passwordCompare){
                return res.status(400).json({error: "Invalid Credentials"});
            }

            const fetchedStudent = {
                user: {
                    serial_id: student[0].serial_id
                }
            }

            const authToken = jwt.sign(fetchedStudent,JWT_SECRET);

            res.json({authToken});
        }catch(error){
            console.error(error.message);
            res.status(500).send("internal server error");
        }
});

// addition of credits by student 
// POST "/api/student/addcreds"
// login reqd
router.put('/addcreds/:regn_no',fetchuser,[
    body('credits').isNumeric()
    ],
    async (req,res)=>{
        // if errors are there return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            let fetchedStudent = await studop.findStudent(req.params.regn_no);
            if(fetchedStudent.length==0){
                return res.status(400).json({error: "Invalid Credentials"});
            }
            if(fetchedStudent[0].serial_id!==req.user.serial_id){
                return res.status(400).json({error: "Not Allowed"});
            }
    
            let updatedStudent = await studop.addCredits(req.params.regn_no,req.user.serial_id,req.body.credits);
    
            res.json({success:"success",status:updatedStudent});
        }catch(error){
            console.error(error.message);
            res.status(500).send("internal server error");
        }
    });

module.exports = router;