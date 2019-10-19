const puppeteer = require("puppeteer");

const scrape = async () => {
    const browser = await puppeteer.launch();
    
    const page = await browser.newPage();

    // to prevent mobile view
    await page.setViewport({width: 1200, height: 720});

    await page.goto('https://www.datacamp.com/users/sign_in');

    // make screenshot of where we are
    await page.screenshot({path: 'screenshot.png'});

    // close browser 
    await browser.close();
}

scrape();