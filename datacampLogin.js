const timeout = require('./timeout');

const datacampLogin = async (page, username, password) => {

    // load sign in page
    await page.goto('https://www.datacamp.com/users/sign_in');
    console.log('datacamp loaded');
    
    // type in username
    await page.type('#user_email', username);
    console.log('username entered');
    
    // click "next"-button and wait for website feedback
    await Promise.all([
        page.click('.js-account-check-email'),
        page.waitForSelector('#user_password', { visible: true, }),
    ]);
    
    // type in password
    await page.type('#user_password', password);
    console.log('password entered')
    
    // click "sign in"-button and wait for redirect page to load
    await Promise.all([
        page.click('.js-modal-submit-button'),
    ]);
    
    try {
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
    } catch (error) {
        console.log('timeout error');
    }
    
    // wait some more to make sure
    await timeout(5000);
    
    // show url that was redirected to
    console.log('redirected to: ' + page.url());

    return page;
}

module.exports = datacampLogin;