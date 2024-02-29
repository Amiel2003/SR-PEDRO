const CryptoJS = require('crypto-js')
const secretKey = process.env.CRYPTOJS_SECRET_KEY
const {addProduct} = require('../functions/database')
const {retrieveCollection,retrieveDataFromCollection} = require('../functions/database')
const ProductModel = require('../models/productsModel')

async function getAllProducts(req,res){
    const productsData = await retrieveCollection('Products')
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(productsData), secretKey).toString();
    return res.status(200).json({products: encryptedData})
}

async function insertProduct(req,res){
    const decryptedData = JSON.parse(CryptoJS.AES.decrypt(req.body.data, secretKey).toString(CryptoJS.enc.Utf8));
    const result = await addProduct(decryptedData)
    return res.json(result)
}

async function getProductByID(req,res,id){
    const product = await retrieveDataFromCollection('_id',id,ProductModel)
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(product), secretKey).toString();
    return res.status(200).json({product: encryptedData})
}

module.exports = {getAllProducts,insertProduct,getProductByID}