const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');
const studop = require('../operations/studentOperations');
const retop = require('../operations/retailerOperations');
const transop = require('../operations/transactOperation');

// transaction between student and retailer
router.put('/transact',[
    body('regn_no').isLength({min: 9, max: 9}),
    body('retailer_id').isLength({min: 10,max: 10}),
    body('credits').exists().isNumeric()
    ],
    async (req,res)=>{
        // if errors are there return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const {regn_no,retailer_id,credits} = req.body;
            let transaction = await transop.Transact(regn_no,retailer_id,credits);
            res.json({transaction});
        } catch (error) {
            console.error(error.message);
            res.status(500).send("internal server error");
        }
    });

    module.exports = router;