const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('profile', {username: req.user.username, email: req.user.email, name: req.user.name})
})


module.exports = router