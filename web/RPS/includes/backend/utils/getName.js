const User = require('../models/user')

module.exports = async (name) => {
    // User.findOne({username: username}).then((user) => user).catch((e) => console.log("User not found"))
    try {
        const user = await User.find({name: name})
        if(user.length > 1){
            return("User already exists")
        }
        else if(user.length == 1){
            return(user)
        }
        else {
            return(null)
        }
    } catch (error) {
        return(error)
    }
}