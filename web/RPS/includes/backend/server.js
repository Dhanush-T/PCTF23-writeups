const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const jwtAuth = require('./utils/jwtAuth')


require('dotenv').config()

// Database Connection

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', async () => {
    console.log("Connected")
})


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

app.get('/', (req, res) => {
    res.redirect('/register')
})

const loginRouter = require('./routes/login')
app.use('/login', loginRouter)
const registerRouter = require('./routes/register')
app.use('/register', registerRouter)
const homeRouter = require('./routes/home')
app.use('/home', jwtAuth, homeRouter)
const profileRouter = require('./routes/profile')
app.use('/profile', jwtAuth, profileRouter)
const leaderboardRouter = require('./routes/leaderboard')
app.use('/leaderboard', jwtAuth, leaderboardRouter)
const passRouter = require('./routes/pass')
app.use('/pass', jwtAuth, passRouter)
const emailRouter = require('./routes/email')
app.use('/email', jwtAuth, emailRouter)
const userRouter = require('./routes/user')
app.use('/user', jwtAuth, userRouter)
const logoutRouter = require('./routes/logout')
app.use('/logout', jwtAuth, logoutRouter)
const playRouter = require('./routes/play')
app.use('/play', jwtAuth, playRouter)
const adminRouter = require('./routes/admin')
app.use('/admin', jwtAuth, adminRouter)


app.listen(process.env.PORT || 3000)