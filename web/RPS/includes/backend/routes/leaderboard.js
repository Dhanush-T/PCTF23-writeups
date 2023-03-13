const express = require('express')
const router = express.Router()

const User = require('../models/user')

const users = require('../utils/populate')


router.get('/', async (req, res) => {
    const user = req.user
    const usersCopy = [...users, {username: user.username, score: user.score}]
    usersCopy.sort((a,b) => b.score - a.score)
    res.render('leaderboard', {users: usersCopy.slice(0,10)})

})


module.exports = router
