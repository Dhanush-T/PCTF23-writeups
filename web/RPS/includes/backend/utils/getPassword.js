const User = require('../models/user')
const bcrypt = require('bcrypt')
const decrypt = require('./decrypt')

module.exports = async (name, password) => {
    const result = await User.findOne({name: name}).then(async (user) => {
        const result = decrypt(user.password) == password
        return(result)
    })
    return(result)
}