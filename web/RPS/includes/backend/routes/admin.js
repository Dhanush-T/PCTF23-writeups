const express = require('express')
const router = express.Router()


router.get('/', async (req, res) => {

    if(req.user && req.user.name == 'admin' && req.query.username){
        res.render('admin', {username: req.query.username})
    }else{
        res.sendStatus(403)
    }

})


module.exports = router