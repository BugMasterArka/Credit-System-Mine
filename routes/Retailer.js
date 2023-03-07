const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const retop = require('../operations/retailerOperations');
const unid = require('generate-unique-id');
const fetchuser = require('../middlewares/fetchuser');

const  JWT_SECRET = 'mYJWT$ECrEt';

// registering a retailer 
// using POST "/api/retailer/addretailer"
// no login reqd
router.post('/addretailer',[
    body('name','Must have a minimum length of 5').exists().isLength({min: 5}),
    body('phone','Must be a 10 or 11 digit phone number').exists().isLength({min:10 ,max:10}),
    body('password','Must have a minimum length of 5').exists().isLength({min: 5})
    ],
    async (req,res)=>{
        // if errors are there return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            const {name,phone,password}=req.body;

            let retailer_id = unid({length: 10, useNumbers: true,useLetters: false});
            let balance = 0.00;

            let salt = await bcrypt.genSalt(10);
            let secPass = await bcrypt.hash(password,salt);

            let savedRetailer = retop.registerRetailer(retailer_id,name,phone,balance,secPass);

            res.json(savedRetailer);
        }catch(error){
            console.error(error.message);
            res.status(500).send("internal server error");
        }
    });

// login a retailer
// using POST "/api/retailer/login"
// no login reqd
router.post('/login',[
    body('retailer_id','Enter a valid retailer ID').isLength({min:10, max:10}),
    body('password','Enter a valid password').exists()
    ],
    async (req,res)=>{
        // if errors are there return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try{
            const {retailer_id,password} = req.body;

            let fetchedRetailer = await retop.loginRetailer(retailer_id);
            console.log(fetchedRetailer);
            if(fetchedRetailer.length==0){
                console.log('no retailer');
                return res.status(400).json({error: "Invalid Credentials"});
            }
            let passwordCompare = await bcrypt.compare(password,fetchedRetailer[0].password);
            if(!passwordCompare){
                console.log('wrong password');
                return res.status(400).json({error: "Invalid Credentials"});
            }
    
            const data = {
                user: {
                    retailer_id: retailer_id
                }
            };
    
            const authToken = jwt.sign(data,JWT_SECRET);
            res.json({authToken});
        }catch(error){
            console.error(error.message);
            res.status(500).send("internal server error");
        }
    });

// fetch balance for retailer account
// using POST "/api/retailer/fetchcreds"
// login reqd
router.post('/fetchcreds',fetchuser,
    async (req,res)=>{
        try {
            let fetchBalance = await retop.fetchBalance(req.user.retailer_id);
            res.json({balance:fetchBalance[0].balance});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("internal server error");
        }
    });

// delete a retailer
// using DELETE "/api/retailer/deleteretailer"
// login reqd
router.delete('/deleteretailer',fetchuser,
    async (req,res)=>{
        try {
            let deletedRetailer = await retop.deleteRetailer(req.user.retailer_id);
            res.json({status:"OK",message:deletedRetailer});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("internal server error");
        }
    })

    module.exports = router;