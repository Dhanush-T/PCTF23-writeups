const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const getName = require('../utils/getName')

const User = require('../models/user')
const getPassword = require('../utils/getPassword')
const jwtAuth = require('../utils/jwtAuth')


router.get('/', async (req, res) => {
    const token = req.cookies.token
    if(token == null){
        res.render('login')
    }
    else{
        await jwtAuth(req, res, () => res.redirect('../home'))
    }
})

router.post('/', async (req, res) => {
    
    const token = req.cookies.token

    if(token == null){
        if(req.body.name && req.body.password){
            if(req.body.name == 'admin' && req.body.password == process.env.ADMIN_PASSWORD){
                res.render('flag', {flag: process.env.FLAG})
            }
            else {
                User.findOne({name: req.body.name}).then(async (user) => {
                    if(user == null){
                        res.render('login', {message: "User doesn't exist"})
                    }
                    else{
                        const result = await getPassword(req.body.name, req.body.password)
                        if(result){
                            console.log("Logging in as", user)
                            const token = jwt.sign({user_id: user._id}, process.env.SECRET, {expiresIn: "1h"})
                            res.cookie("token", token, {
                                httpOnly: true
                            })
                            res.redirect('../home')
                        }
                        else{
                            res.render('login', {message: "Invalid Password"})
                        }

                    }
                })

            }
            
        }
        else{
            res.redirect('/')
        }
        
    }
    else{
        await jwtAuth(req, res, () => res.redirect('../home'))
    }

})

module.exports = router