const express = require('express')
const router = express.Router()
const jwt =require('jsonwebtoken')
const puppeteer = require('puppeteer');

async function getSS(url_param) {
    const url = new URL(url_param)
    const blacklisted_urls = [
        'localhost',
        '127.0.0.1',
        '::1',
        '0:0:0:0:0:0:0:1',
        'file://'
    ]

    // Comment this out for local testing
    for(let i=0; i< blacklisted_urls.length; i++){
        if(url.href.includes(blacklisted_urls[i])){
            throw new Error('Cannot access local files >:')
        }
    }
    
    const browser = await puppeteer.launch({
        executablePath: 'google-chrome-stable',
        args: [
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--autoplay-policy=user-gesture-required',
        '--disable-background-networking',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-breakpad',
        '--disable-component-update',
        '--disable-default-apps',
        '--disable-domain-reliability',
        '--disable-extensions',
        '--disable-features=AudioServiceOutOfProcess',
        '--disable-hang-monitor',
        '--disable-notifications',
        '--disable-offer-store-unmasked-wallet-cards',
        '--disable-speech-api',
        '--disable-sync',
        '--hide-scrollbars',
        '--metrics-recording-only',
        '--mute-audio',
        '--no-default-browser-check',
        '--no-pings',
        '--use-gl=swiftshader',
        ]
    });

    const page = await browser.newPage()
    await page.setCookie({
        name: "token",
        value: jwt.sign({token: "authorized"}, process.env.SECRET, { 'expiresIn': '5s' }),
        url: process.env.ORIGIN
    })
    await page.goto(url, {waitUntil: 'domcontentloaded'})

    const ss = await page.screenshot({encoding: "binary", type: "jpeg", quality: 20});
    await browser.close()
    return ss
}

router.get('/', (req, res) => {
    res.render('bot', {origin: process.env.ORIGIN})
})

router.post('/', async (req, res) => {
    const url_param = req.body.url
    if(url_param) {
        getSS(url_param)
            .then((ss) => {
                res.setHeader('Content-type', 'image/jpeg')
                res.send(ss)
            })
            .catch(err => {       
                res.render('bot', {origin: process.env.ORIGIN, error: "Invalid URL"})
            })
    }
    else{
        res.send('No url provided')
    }
})
module.exports = router