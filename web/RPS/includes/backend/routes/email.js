const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const toRender = require('../utils/toRender')

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


router.get('/', (req, res) => {
    res.render('email', {toRender: toRender[0]})
})

router.post('/', async (req, res) => {
    if(req.user.name != 'admin'){
        try {
            if(isEmailValid(req.body.newEmail)) {
                const user = await User.findOne({name: req.user.name})
                await User.updateOne({_id: user._id}, {$set: {email: req.body.newEmail}})
                console.log("Email changed for", user.name)
                res.render('email', {toRender: toRender[1]})
    
            } 
            else {
                res.render('email', {toRender: toRender[2]})
            }
        } catch (error) {
            res.render('email', {toRender: toRender[2]})
        }
        
    }
    else {
        try {
            if(isEmailValid(req.body.email)) {
                res.cookie("flag", "1", {
                    httpOnly: true,
                    // secure: true,
                    // domain: "backend", // without this, it doesn't work?
                    encode: v => v
                })
                res.cookie("email", req.body.email, {
                    httpOnly: true,
                    // secure: true,
                    // domain: "backend",
                    encode: v => v
                })
                res.send()
            }
        } catch (error) {
            res.render('email', {toRender: toRender[2]})
        }
        
    }
    
    
})




module.exports = router