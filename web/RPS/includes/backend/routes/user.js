const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const toRender = [
    `<input type='text' placeholder='New Username' name="newUsername" required/>
    <button type='submit'>Submit</button>`,
    `<div>Username has been updated successfully</div>
    <a href='../'>Go Back</a>`
]

router.get('/', (req, res) => {
    res.render('user', {toRender: toRender[0]})
})

router.post('/', async (req, res) => {
    
    try {
        if(req.user.name != 'admin'){
            const user = await User.findOne({name: req.user.name})
            await User.updateOne({_id: user._id}, {$set: {username: req.body.newUsername, changed: true}})
            console.log("Username changed for", user.username)
            res.render('user', {toRender: toRender[1]})
        } 

    } catch (error) {
        return(error)
    }
})

module.exports = router