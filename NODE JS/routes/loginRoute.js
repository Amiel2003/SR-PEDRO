const express = require('express');
const router = express.Router()
const {handleLogin} = require('../controllers/loginController')

router.post('/',async (req,res) => {
    handleLogin(req,res)
})

module.exports = router;