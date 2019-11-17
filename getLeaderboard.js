const timeout = require('./timeout');
const moment = require('moment');
const cheerio = require('cheerio');

const getLeaderboard = async (page) => {

    // go to yearly leaderboard
    // await page.goto('https://www.datacamp.com/enterprise/marketing-analytics-marketing-2/leaderboard/year');
    await page.goto('https://www.datacamp.com/enterprise/marketing-analytics-marketing-2-aac75f17-7035-4029-a002-40e13ad970c8/leaderboard/year');
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

module.exports = getLeaderboard;