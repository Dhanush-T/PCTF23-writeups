const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const { lookup } = require('geoip-lite');
const useragent = require('useragent');

require('dotenv').config()

app.use(express.static('public'));
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
app.use(cookieParser())

app.use(express.urlencoded({ extended: true }));
app.disable('x-powered-by')
app.use(function(req, res, next) {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

function getData(token){
    return {
        'username': Buffer.from(token['username'], "base64").toString('ascii'),
        'role': Buffer.from(token['role'], "base64").toString('ascii')
    }
}

function makeData(username, role){
    return {
        'username': Buffer.from(username).toString('base64'),
        'role': Buffer.from(role).toString('base64')
    }
}

function jwtAuth(req, res, next){
    
    try{
        const agent = useragent.parse(req.headers['user-agent'])
        const ip = req.headers['x-forwarded-for'] || req.ip
        if(lookup(ip) && lookup(ip).country == 'TR' && agent && agent.os.family == "Windows 95"){
            const token = jwt.verify(req.cookies.token, process.env.TOKEN)
            req.data = getData(token)
            next()
        }
        else{
            res.cookie('token', "")
            res.redirect('/')
        }
        
    }
    catch(e){
        res.cookie('token', "")
        res.redirect('/')
    }
    
}


app.get('/', (req,res) => {
    if(!req.cookies.token) {
        res.render("index")
    }
    else {
        res.redirect('/guest')
    }
})

app.post('/', (req, res) => {
    
    try {
        if(!req.cookies.token){
            const agent = useragent.parse(req.headers['user-agent'])
            const ip = req.headers['x-forwarded-for'] || req.ip
            if(req.body.username == 'guest' && ip && lookup(ip).country == 'TR' && agent && agent.os.family == "Windows 95" && !req.cookies.token){
                res.cookie('token', jwt.sign(makeData(req.body.username, "0"), process.env.TOKEN))
                res.redirect('/guest')
            }
            else {
                res.cookie('token', "")
                res.redirect('/')
            } 
        }
        else{
            res.redirect('/guest')
        }
         
    } catch (e) {

        res.cookie('token', "")
        res.redirect('/')
    }
    
})

app.get('/guest', jwtAuth, (req,res) => {
    if(req.data.role != '1') res.render("guest")
    else res.redirect("/admin")
})

app.get('/admin', jwtAuth, (req,res) => {
    if(req.data.role == '1') res.render("admin")
    else res.redirect('/guest')
})

app.get('/logout', (req, res) => {
    res.clearCookie('token')
    res.redirect('/')
})

app.get('/'+process.env.ROUTE, jwtAuth, (req, res) => {
    res.render('flag', {flag: process.env.FLAG})
})


app.listen(3000)