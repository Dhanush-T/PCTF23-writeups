const express = require('express')
const router = express.Router()
const User = require('../models/user')


router.get('/', async (req, res) => {
    res.render('play')
})

router.post('/', async (req, res) => {
    if(req.body.score != null){
        const score = req.body.score
        const user = req.user
        let highScore = user.score
        if(score > highScore){
            highScore = score
            await User.updateOne({_id: user._id}, {$set: {score: score}})
        }
        res.render('won', {score: score, highScore: highScore})
    }
    else{
        res.render('play')
    }
})

module.exports = router