const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser'); //middleware to POST data
const {getAllProducts,insertProduct,getProductByID} = require('../controllers/productsController')

router.use(bodyParser.urlencoded({ extended: true }));

router.get('/',(req,res)=>{
    getAllProducts(req,res)
})

router.post('/',(req,res)=>{
    insertProduct(req,res)
})

router.get('/:id',(req,res)=>{
    const id = req.params.id
    getProductByID(req,res,id)
})

module.exports = router