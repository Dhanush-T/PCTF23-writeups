const jwt = require('jsonwebtoken')
const User = require('../models/user')
const decrypt = require('./decrypt')

module.exports = async (req, res, next) => {
    const token = req.cookies.token

    try {
        const user = jwt.verify(token, process.env.SECRET)
        if(user.name && user.name == "admin" && user.password && decrypt(user.password) == process.env.ADMIN_PASSWORD) {
            req.user = user
        }
        else{
            req.user = await User.findById(user.user_id)
        }
        next()
        
    }
    catch{
        res.clearCookie("token")
        res.redirect('../login')
    }

}