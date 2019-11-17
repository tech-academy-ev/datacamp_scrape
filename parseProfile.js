const cheerio = require('cheerio');
const fs = require('fs');

const parseProfile = (fromFile, url, date, content) => {
    // from file either false or [urlParam, 'YYYYMMDD']

    if(fromFile) {
        content = fs.readFileSync(`./profile_${fromFile[0]}_${fromFile[1]}.html`, 'utf8');
    }

    // load content into cheerio for parsing
    const $ = cheerio.load(content);

    const name = $('h1').text();

    const stats = $('.profile-header__stats').find('strong');

    let statsList = [];

    const statsMap = $(stats).each((i, element) => {
        statsList.push($(element).text());
    });

    let xp = statsList[0];
    xp = xp.replace(/\,/g,'');
    const courseNum = statsList[1];
    let exercisesNum = statsList[2];
    exercisesNum = exercisesNum.replace(/\,/g,'');

    console.log(name);
    console.log(xp);
    console.log(courseNum);
    console.log(exercisesNum);

    const courses = $('.profile-courses').find('.course-block');

    let courseList = [];

    const coursesMap = $(courses).each((i, element) => {
        courseList.push($(element).find('h4').text());
    })

    console.log(courseList);
    const data = `${url},${date},${name},${xp},${courseNum},${exercisesNum},[${courseList}]\n`
    fs.appendFile("./data.txt", data, (err) => {if(err){console.log('couldnt append')}});
}

module.exports = parseProfile;