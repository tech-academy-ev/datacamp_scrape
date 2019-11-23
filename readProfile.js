const moment = require('moment');
const fs = require('fs');
const parseProfile = require('./parseProfile');

const readProfile = async (page, url) => {

    await page.goto(url);
    console.log(`profile ${url} loaded`);

    const content = await page.content();

    const urlParam = url.split('/');
    const currDate = moment().format('YYYYMMDD');

    if(!fs.existsSync('./' + currDate)){
        fs.mkdirSync(currDate);
    }

    fs.writeFile(`./${currDate}/profile_${urlParam[urlParam.length - 1]}_${currDate}.html`, content, (err) => {if(err){console.log('couldnt write')}});

    parseProfile(false, url, currDate, content);
}

module.exports = readProfile;