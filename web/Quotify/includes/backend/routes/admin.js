const express = require('express')
const router = express.Router()
const jwt =require('jsonwebtoken')

router.get('/', (req, res) => {
    const token = req.cookies.token
    try {
        jwt.verify(token, process.env.SECRET)
        res.render('admin')
    } catch (e) {
        console.log(e)
        res.send('Only Admin is allowed here not you!')
    }
})

module.exports = router