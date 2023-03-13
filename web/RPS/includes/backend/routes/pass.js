const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer');


const User = require('../models/user');
const decrypt = require('../utils/decrypt');

const toRender = [
    `<div>Your password will be sent to your email</div>
    <button type='submit' onClick="this.form.submit(); this.disabled=true; this.texContent='Sending…';">Send email</button>`,
    `<div>Email is sent successfully</div>
    <a href='../'>Go Back</a>`,
    `<div>Email is invalid. Change your Email and try again</div>`
]

router.get('/', (req, res) => {
    res.render('pass', {toRender: toRender[0]})
})

router.post('/', async (req, res) => {


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASS
    }
    });

    console.log(req.user.name,"is getting their password")
    if(req.user.name == 'admin'){
        console.log("setting flag = 2 cookie")
        res.cookie("flag", "2", {
            httpOnly: true,
            encode: v => v
        })
        res.send()
    } 
    else {
        var password = req.user.password
        var mailOptions = {
            from: process.env.APP_EMAIL,
            to: req.user.email,
            subject: 'Your Password for RPS',
            text: `PASSWORD: ${decrypt(password)}`
            };
        
        try {
            const mail = await transporter.sendMail(mailOptions)
            res.render('pass', {toRender: toRender[1]})
        } catch (e){
            console.log(e)
            res.render('pass', {toRender: toRender[2]})
}

    
    }
})


module.exports = router