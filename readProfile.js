const moment = require('moment');
const fs = require('fs');
const parseProfile = require('./parseProfile');

const readProfile = async (page, url) => {

    await page.goto(url);
    console.log(`profile ${url} loaded`);

    const content = await page.content();

    const urlParam = url.split('/');
    const currDate = moment().format('YYYYMMDD');

    fs.writeFile(`./profile_${urlParam[urlParam.length - 1]}_${currDate}.html`, content, (err) => {if(err){console.log('couldnt write')}});

    parseProfile(false, content);
}

module.exports = readProfile;