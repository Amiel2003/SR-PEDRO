const CryptoJS = require('crypto-js')
const secretKey = process.env.CRYPTOJS_SECRET_KEY
const {addProduct,updateData,handleArchive} = require('../functions/database')
const {retrieveCollection,retrieveDataFromCollection} = require('../functions/database')
const ProductModel = require('../models/productsModel')
const ArchiveProduct = require('../models/archiveProductModel')

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

async function editProduct(req,res){
    productInfo = req.body.data
    const id = productInfo._id
    const value = productInfo.value
    const attribute = productInfo.attribute
    const updateProduct = await updateData(id, value, attribute, ProductModel)
    if (updateProduct === true) {
        return res.status(200).json({message: 'Employee updated successfully!'})
    }
}

async function getProductByID(req,res,id){
    const product = await retrieveDataFromCollection('_id',id,ProductModel)
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(product), secretKey).toString();
    return res.status(200).json({product: encryptedData})
}

async function archiveProduct(req,res){
    id = req.body.id
    const decryptedID = CryptoJS.AES.decrypt(req.body.id, secretKey).toString(CryptoJS.enc.Utf8)
    const result = await handleArchive(id, ProductModel, '_id', ArchiveProduct)
    return res.json(result)
}

module.exports = {getAllProducts,insertProduct,getProductByID,editProduct,archiveProduct}