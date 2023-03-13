const express = require('express')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const app = express()
const mongoose = require('mongoose')
const { seedInit } = require('./utils/populate')
const rateLimit = require('express-rate-limit')


const limiter = rateLimit({
	windowMs:  10 * 1000, 
	standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
    message:
		'Too many requests sent in a short time. Try again after 10 seconds',
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

require('dotenv').config()

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', async () => {
    console.log("Connected")
})

seedInit()

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: false }))
app.use(cookieParser())
app.disable('x-powered-by')
app.use(function(req, res, next) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

function jwtAuth(req, res, next) {
    const token = req.cookies.token
    if(token == null){
        res.redirect('/login')
    }else{
        try{
            const validate = jwt.verify(token, process.env.SECRET)
            next()
        } catch{
            res.clearCookie('token')
            res.redirect('/login')
        }
    }
}

app.get('/', (req, res) => {
    res.redirect('/login')
})

const botRouter = require('./routes/bot')
app.use('/bot', limiter, botRouter)
const loginRouter = require('./routes/login')
app.use('/login', loginRouter)
const homeRouter = require('./routes/home')
app.use('/home', jwtAuth, homeRouter)
const logoutRouter = require('./routes/logout')
app.use('/logout', logoutRouter)
const searchRouter = require('./routes/search')
app.use('/search', jwtAuth, searchRouter)
const passRouter = require('./routes/pass')
app.use('/pass', passRouter)

app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000")
})