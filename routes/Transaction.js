const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const studop = require('../operations/studentOperations');
const retop = require('../operations/retailerOperations');

// transaction between student and retailer
router.put('/transact',[
    body('regn_no').isLength({min: 9, max: 9}),
    body('retailer_id').isLength({min: 10,max: 10})
    ],
    async (req,res)=>{
        
    });