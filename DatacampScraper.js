const puppeteer = require("puppeteer");
const timeout = require('./timeout')
const fs = require('fs');

const datacampLogin = require('./datacampLogin');
const getLeaderboard = require('./getLeaderboard');

require('dotenv').config();

const usr = process.env.USERNAME;
const pwd = process.env.PASSWORD;

class DatacampScraper {
    constructor(username, password) {
        this.username = username;
        this.password = password;
        this.browser = undefined;
        this.page = undefined;
    }

    async launchBrowser() {
        this.browser = await puppeteer.launch({ "headless": false});
    }

    async closeBrowser() {
        await this.browser.close();
    }

    async login() {
        this.page = await this.browser.newPage();
        // to prevent mobile view
        await this.page.setViewport({width: 1200, height: 800});

        // actually log in 
        this.page = await datacampLogin(this.page, this.username, this.password);
    }

    async getLeaderboard(filename, path) {
        const leaderboardLinks = await getLeaderboard(this.page);

        if(path) {
            fs.mkdirSync(path);
            path = path + "/";
        } else {
            path = "";
        }

        fs.writeFile("./" + path + filename, leaderboardLinks, (err) => {if(err){console.log('couldnt write')}});
    }

    getBrowser() {
        return this.browser;
    }



};

const mainFunc = async () => {
    test = new DatacampScraper(usr, pwd);
    await test.launchBrowser();
    await test.login();
    await test.getLeaderboard('test.txt');
    await test.closeBrowser();
}

mainFunc();

