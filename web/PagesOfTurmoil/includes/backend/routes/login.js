const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.get('/', (req, res) => {
    const token = req.cookies.token
    if(token == null) res.render('login', {origin: process.env.ORIGIN})
    else res.redirect('/home')
})

router.post('/', (req, res) => {
    const token = req.cookies.token
    if(token == null){
        if(req.body.password === process.env.PASSWORD){
            const token = jwt.sign({user: "authorized"}, process.env.SECRET)
            res.cookie("token", token, {
                httpOnly: true
            })
            res.redirect('/home')
        }
        else{
            res.render('login', {origin: process.env.ORIGIN, error: 'Password Incorrect. Try Again'})
        }
    }
    else {
        res.redirect('/home')
    }
    
})

module.exports = router