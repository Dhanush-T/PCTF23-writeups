const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const jwtAuth = require('../utils/jwtAuth')
const getName = require('../utils/getName')
const encrypt = require('../utils/encrypt')

var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;


function isEmailValid(email) {
    if (!email)
        return false;

    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}

router.get('/', async (req, res) => {
    const token = req.cookies.token
    if(token == null){
        res.render('register')
    }
    else{
        await jwtAuth(req, res, () => res.redirect('../home'))
    }
})

router.post('/', async (req, res) => {
    const token = req.cookies.token
    if(token == null){
        const username = req.body.username
        const name = req.body.name
        const password = req.body.password
        const email = req.body.email
        const user = await getName(name)
        if(user == null){
            if(isEmailValid(email)){
                
                const hash = encrypt(password)
                const userdata = {name: name, username: username, password: hash, email: email} // Changes this if need arises
                const token = jwt.sign({user_id: (await User.create(userdata))._id}, process.env.SECRET, {expiresIn: "1h"})
                console.log("User created")
                res.cookie("token", token, {
                    httpOnly: true
                })
                res.redirect('../home')
            }
            else{
                res.render('register', {message: "Email is Invalid!"})
            }

        } else{
            res.render('register', {message: "User already exists"})
        }
    }
    else {
        await jwtAuth(req, res, () => res.redirect('../home'))
    }
    
})

module.exports = router