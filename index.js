const puppeteer = require("puppeteer");

require('dotenv').config();

const usr = process.env.USERNAME;
const pwd = process.env.PASSWORD;

const scrape = async () => {
    const browser = await puppeteer.launch();
    
    const page = await browser.newPage();

    // to prevent mobile view
    await page.setViewport({width: 1200, height: 720});

    await page.goto('https://www.datacamp.com/users/sign_in');

    // type in username
    await page.type('#user_email', usr);

    // click "next"-button and wait for website feedback
    await Promise.all([
        page.click('.js-account-check-email'),
        page.waitForSelector('#user_password', { visible: true, }),
    ]);

    // type in password
    await page.type('#user_password', pwd);

    // click "sign in"-button and wait for redirect page to load
    await Promise.all([
        page.click('.js-modal-submit-button'),
        page.waitForNavigation({ waitUntil: 'networkidle2' }),
    ]);

    // show url that was redirected to
    console.log('redirected to: ' + page.url());

    // make screenshot of where we are
    await page.screenshot({path: 'screenshot.png'});

    // close browser 
    await browser.close();
}

scrape();