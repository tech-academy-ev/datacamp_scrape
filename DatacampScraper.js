const puppeteer = require("puppeteer");
const timeout = require('./timeout')

const datacampLogin = require('./datacampLogin');

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

    getBrowser() {
        return this.browser;
    }



};

const mainFunc = async () => {
    test = new DatacampScraper(usr, pwd);
    await test.launchBrowser();
    await test.login();
    await test.closeBrowser();
}

mainFunc();

