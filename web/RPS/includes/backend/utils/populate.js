const User = require('../models/user')
const bcrypt = require('bcrypt')
require('dotenv').config({path: '../.env'})

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function makeScore() {
    return Math.floor((Math.random()*5))
}


const users = []

for (let i = 0; i < 20; i++) {
    users.push({
        username: makeid(10),
        score: makeScore()
    })
}

module.exports = users
