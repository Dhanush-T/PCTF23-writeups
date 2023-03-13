const mongoose = require('mongoose')
require('dotenv').config()
const userSchema = new mongoose.Schema({
    username:  String,
    name: String,
    email: String,
    password: String,
    score: {
        type: Number,
        default: 0
    },
    changed: {
        type: Boolean,
        default: false
    },
    adminEmail: {
        type: String,
        default: process.env.ADMIN_EMAIL
    },
})

module.exports = mongoose.model("User", userSchema)