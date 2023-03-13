const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const passText = require('../utils/pass')


router.get('/', (req, res) => {
    const token = req.cookies.token
    try {
        jwt.verify(token, process.env.SECRET)
        console.log("The bot visited the page")
        res.send(passText)
    } catch (e) {
        res.send('Only bot is allowed here not you!')
    }
})

module.exports = router