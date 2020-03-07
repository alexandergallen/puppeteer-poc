const assert = require('assert');
const { Given, When, And, Then, Before, BeforeAll, After, AfterAll } = require('cucumber');
const puppeteer = require("puppeteer");

Before(async function () {
    this.browser = await puppeteer.launch({ headless: false });
    this.page = await this.browser.newPage();
});

After(async function () {
    await this.browser.close();
})

Given('I have opened {string}', async function (string) {
    await this.page.goto(string);
});

Given('I have ordered the items by {string}', async function (string) {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

When('The items are ordered', async function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

Then('The items are properly ordered', async function () {
    // Write code here that turns the phrase above into concrete actions
    return 'pending';
});

