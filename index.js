const puppeteer = require("puppeteer");
const fs = require('fs');

const datacampLogin = require('./datacampLogin');
const getLeaderboard = require('./getLeaderboard');
const readProfile = require('./readProfile');

require('dotenv').config();

const usr = process.env.USERNAME;
const pwd = process.env.PASSWORD;

const scrape = async (withLeaderboard, fromFile) => {
    const browser = await puppeteer.launch({ "headless": false});
    
    let page = await browser.newPage();

    // to prevent mobile view
    await page.setViewport({width: 1200, height: 720});

    page = await datacampLogin(page, usr, pwd);

    if(withLeaderboard){
        const leaderboardLinks = await getLeaderboard(page);
        console.log(leaderboardLinks);
    
        // write html to file for further development (without pinging datacamp too much)
        fs.writeFile("./leaderboard_links.txt", leaderboardLinks, (err) => {if(err){console.log('couldnt write')}});
    }

    if(fromFile){
        let leaderboardLinks = fs.readFileSync('./leaderboard_links.txt', 'utf8');
    
        leaderboardLinks = leaderboardLinks.split(',');

        await readProfile(page, leaderboardLinks[1]);
    }


    // close browser 
    await browser.close();

}

scrape(false, true);
//parseProfile(['niclaslindemann', '20191027'], false);