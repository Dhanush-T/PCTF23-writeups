const express = require('express')
const createDOMPurify = require('dompurify');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const router = express.Router()
const puppeteer = require('puppeteer');
const jwt =require('jsonwebtoken')


async function admin_check(feedback, quote_id) {
    const url = new URL(process.env.ORIGIN+"/admin")
    const browser = await puppeteer.launch({
        executablePath: 'google-chrome-stable',
        args: [
        "--disable-gpu",
        "--disable-dev-shm-usage",
        ]
    });
    let flag = false;
    const page = await browser.newPage()
    page.on("console", async (msg) => {
        if(msg.text() == "Got flag woohooo. Pretty simple right?"){
            flag = true
        }
    });
    await page.setCookie({
        name: "token",
        value: jwt.sign({token: "authorized"}, process.env.SECRET, { 'expiresIn': '3s' }),
        url: process.env.ORIGIN
    })

    await page.goto(url)
    await page.evaluate((feedback, quote_id) => {
       let dom = document.body
       dom.innerHTML = `
       <div class="feedback">${feedback}</div>
       <div class="quote_id">${quote_id}</div>
   `;
    }, feedback, quote_id);
    await page.evaluate(() => {
        window.FRUITS = window.FRUITS || {
            bananas: false,
            apples: false,
            oranges: false
        }
        getQuote();
    });
    await page.waitForNetworkIdle()
    await browser.close()
    return flag
}

router.get('/', (req, res) => {
    res.render('feedback')
})

function validateInput(req, res, next) {
    const feedback = req.body.feedback
    const quote_id = req.body.quoteId
    if(!quote_id || !feedback) res.status(400).send("Feedback and Quote ID is necessary")
    else if(feedback.length > 90) res.status(400).send("Feedback should be lesser than 90 characters because I don't like to read long feedbacks")
    else {
        dom_window = new JSDOM(``).window;
        const purify = createDOMPurify(dom_window)
        const clean = purify.sanitize(feedback, {FORBID_TAGS: ['math'], SANITIZE_DOM: false})
        req.body.feedback = clean
        next()
    }
}

router.post('/', validateInput, async (req, res) => {
    const feedback = req.body.feedback
    const quote_id = req.body.quoteId

        
    try{
        const flag = await admin_check(feedback, quote_id)
        if (flag) {
            res.render('feedback', { flag: process.env.FLAG })
        } else {
            res.render('feedback', {flag: "I think you are bonkers. The quote motivates me to live less so I am not changing it."})
        }
    } catch(e) {
        console.log(e)
        res.render('feedback')
    }
            
})

module.exports = router