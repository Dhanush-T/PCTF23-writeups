const express = require('express')
const router = express.Router()
const { books } = require('../utils/populate')

router.get('/', (req, res) => {
    res.render('home', {origin: process.env.ORIGIN, books: books})
})

module.exports = router