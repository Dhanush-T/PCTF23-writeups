const express = require('express')
const app = express()
const quotes = require('./utils/quotes')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')


const limiter = rateLimit({
	windowMs:  10 * 1000, 
	standardHeaders: false, // Return rate limit info in the `RateLimit-*` headers
    message:
		'Too many requests sent in a short time. Try again after 10 seconds',
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

require('dotenv').config()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')

app.use(express.json())
app.use(express.urlencoded({extended: false }))
app.disable('x-powered-by')
app.use(function(req, res, next) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

app.use(cookieParser())


app.get(`/quotes/:id([0-${quotes.length - 1}])`, (req, res) => {
    res.jsonp(quotes[Math.floor(Math.random()*quotes.length)])
})

const homeRouter = require('./routes/home')
app.use('/', homeRouter)
const feedbackRouter = require('./routes/feedback')
app.use('/feedback', limiter,  feedbackRouter)
const adminRouter = require('./routes/admin')
app.use('/admin', adminRouter)

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
  })

app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port 3000")
})