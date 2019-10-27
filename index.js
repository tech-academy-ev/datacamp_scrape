const moment = require('moment');
const cheerio = require('cheerio');
const puppeteer = require("puppeteer");
const fs = require('fs');

require('dotenv').config();

const usr = process.env.USERNAME;
const pwd = process.env.PASSWORD;

const timeout = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const datacampLogin = async (page) => {

    // load sign in page
    await page.goto('https://www.datacamp.com/users/sign_in');
    
    console.log('datacamp loaded');
    
    // type in username
    await page.type('#user_email', usr);
    
    console.log('username entered');
    
    // click "next"-button and wait for website feedback
    await Promise.all([
        page.click('.js-account-check-email'),
        page.waitForSelector('#user_password', { visible: true, }),
    ]);
    
    // type in password
    await page.type('#user_password', pwd);
    
    console.log('password entered')
    
    // click "sign in"-button and wait for redirect page to load
    await Promise.all([
        page.click('.js-modal-submit-button'),
    ]);
    
    try {
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
    } catch (error) {
        console.log(error);
    }
    
    // wait some more to make sure
    await timeout(5000);
    
    // show url that was redirected to
    console.log('redirected to: ' + page.url());

    return page;
}

const getLeaderboard = async (page) => {

    // go to yearly leaderboard
    await page.goto('https://www.datacamp.com/enterprise/marketing-analytics-marketing-2/leaderboard/year');

    console.log('leaderboard loading');

    // wait until table is actually loaded
    await page.waitForSelector('.dc-table__tr');

    console.log('leaderboard loaded');

    // wait some more to make sure
    await timeout(5000);

    // get html of rendered site
    const content = await page.content();

    const id = moment().format();

    // make screenshot of where we are
    await page.screenshot({path: `screenshot${id}.png`});

    console.log('leaderboard loaded');

    // load content into cheerio for parsing
    const $ = cheerio.load(content);

    // select leaderboard-table and make rows-array
    const rows = $('table').find('tr')

    let links = [];
    
    // extract links to profiles from rows and push into links array (.splice(1, n) to limit response)
    const row_array = $(rows).each((i, element) => {
        const cells = $(element).find('td');
        const cell = $(cells).first();
        links.push($(cell).find('a').attr('href'));
    });

    return links;
};

const readProfile = async (page, url) => {

    await page.goto(url);

    console.log(`profile ${url} loaded`);

}

const scrape = async (withLeaderboard, fromFile) => {
    const browser = await puppeteer.launch({ "headless": true});
    
    let page = await browser.newPage();

    // to prevent mobile view
    await page.setViewport({width: 1200, height: 720});

    page = await datacampLogin(page);

    if(withLeaderboard){
        const leaderboardLinks = await getLeaderboard(page);
    
        console.log(leaderboardLinks);
    
        // write html to file for further development (without pinging datacamp too much)
        fs.writeFile("./leaderboard_links.txt", leaderboardLinks, (err) => {if(err){console.log('couldnt write')}});
    }

    if(fromFile){
        let leaderboardLinks = fs.readFileSync('./leaderboard_links.txt', 'utf8');
    
        leaderboardLinks = leaderboardLinks.split(',');

        console.log(leaderboardLinks[1]);

        await readProfile(page, leaderboardLinks[1]);
    }


    // close browser 
    await browser.close();

}

scrape(false, true);