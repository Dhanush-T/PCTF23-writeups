const express = require('express')
const router = express.Router()
const Book = require('../models/book')

router.get('/', (req, res) => {
    res.render('search', {origin: process.env.ORIGIN})
})

router.post('/', async (req, res) => {
    const [ param, value ] = [req.body.parameter, req.body.value]
    const valid = new RegExp("^[\\sa-zA-Z0-9\_]+$")
    
    if(param && value){
        if(valid.test(param) && valid.test(value)){
            if(['_id', 'name', 'author'].includes(param)){
                const query = {}
                query[`${param}`] = value.trim()
                const book = await Book.findOne(query)
                if(book){
                    res.render('search', {origin: process.env.ORIGIN, book: book})
                }
                else{
                    res.render('search', {origin: process.env.ORIGIN, error: "No book found"})
                }
            }
            else {
                res.render('search', {origin: process.env.ORIGIN, error: "Invalid Parameters"})
            }
        }
        else{
            res.render('search', {origin: process.env.ORIGIN, error: "Invalid characters not allowed."})
        }
    }
    else{
        res.redirect('search', {origin: process.env.ORIGIN})
    }
})

module.exports = router