const assert = require('assert');
const { Given, When, And, Then, Before, BeforeAll, After, AfterAll } = require('cucumber');
const puppeteer = require("puppeteer");
const { expect } = require('chai');
var {setDefaultTimeout} = require('cucumber');

setDefaultTimeout(60 * 1000);
let name;
let price;
let dialogPrice;
let finalPrice;

Before(async function () {
    // Adds port 3000 if npm test is run, if npm run testdocker is executed port is set to 3001
    if(this.parameters.port==null){
        this.parameters.port=3000;
    }
    // Creates browser instance before each scenario
    // State is shared within a scenario in cucumber
    this.browser = await puppeteer.launch({
        //headless: false
        //, slowMo: 250
    });
    this.page = await this.browser.newPage();
    // Creates rule for how to handle dialog (After clicking Checkout)
    this.page.on('dialog', async dialog => {
        await this.page.waitFor(250);
        this.dialogPrice=dialog.message().split(" ");
        // Saves price showed in dialog
        this.dialogPrice=this.dialogPrice[this.dialogPrice.length-2]+" "+this.dialogPrice[this.dialogPrice.length-1];
        await this.page.waitFor(250);
        await dialog.accept();
        });
});

After(async function () {
    // Close browser after every scenario
    await this.browser.close();
})

Given('I have opened {string}', async function (string) {
    // Go to webpage specified in feature definition (specified as Background step there)
    var url = string+":"+this.parameters.port;
    await this.page.goto(url, {waitUntil: 'domcontentloaded'});
});

Given('I have ordered the items by {string}', async function (string) {
    // Order items and wait for page to load
    await Promise.all([
        this.page.select('select', string),
        this.page.waitFor(1000),
  ]);
});

Then('The items are properly ordered by {string}', async function (string) {
    // After the items have been ordered, save all prices in an array
    var price = await this.page.$$eval('.shelf-item > .shelf-item__price > .val',
        elements => elements.map(item => item.textContent));
    var result = true;
    var previousPrice;
    // Loop through prices to check that the ordering worked as it should
    price.forEach(function (price,index){
        // Convert string to number
        price = Number(price.replace(/[^0-9.-]+/g,""));
        if(string=="lowestprice"){
            if(index!=0){
                if(previousPrice>price){
                    result=false;
                }
            }
            previousPrice=price;
        }
        else if(string=="highestprice"){
            if(index!=0){
                if(previousPrice<price){
                    result=false;
                }
            }
            previousPrice=price;
        }
    });
    expect(result).to.equal(true);
});

Given('I have filtered the items by size {string}', async function (string) {
    // Filter items and wait for page to load
    await Promise.all([
        this.page.click('input[type=checkbox][value='+string+']'),
        this.page.waitFor(1000),
    ]);
});

When('I add the items to cart', async function () {
    // Add all items that have been filtered to the cart
    await this.page.$$eval('.shelf-item', elements => elements.map(element => element.click()));
});

Then('The items have the correct size {string}', async function (string) {
    // Open bag if not already opened
    await this.page.waitFor(250);
    await this.page.click('.bag');
    // Get every shirt's size from bag
    var shirtSizes = await this.page.$$eval('.shelf-item__details > .desc', 
        elements => elements.map(item => item.textContent.split(" ")[0]));
    // Loop through the array of sizes and compare it with size specified in feature file
    shirtSizes.forEach(function (shirtSize){
        expect(shirtSize).to.equal(string);
    })
});

Given('I have added an item to the cart', async function () {
    // Wait for list to have loaded and click first item
    await this.page.waitFor(250);
    await this.page.waitForSelector('.shelf-item');
    await this.page.click('.shelf-item');
    // Save item name and price for later assertion
    this.name = await this.page.$eval('.shelf-item > .shelf-item__title', element => element.textContent);
    this.price = await this.page.$eval('.shelf-item > .shelf-item__price > .val', element => Number(element.textContent.replace(/[^0-9.-]+/g,"")));
});

When('I delete the item', async function () {
    // Remove item from bag
    await this.page.waitFor(250);
    await this.page.waitForSelector('.shelf-item__del', {visible: true});
    await this.page.click('.shelf-item__del');
});

Then('The cart is empty', async function () {
    // wait for element to exist that proves cart is empty and assert
    var exists = false;
    try {
        await this.page.waitForSelector('.shelf-empty', 10000)
        exists = true;
      } catch (error) {
        exists = false;
      }
    expect(exists).to.equal(true);
});

When('I open the cart', async function () {
    // Open cart if not already opened
    await this.page.waitFor(250);
    await this.page.click('.bag');
});

Then('The cart contains the correct item', async function () {
    // Get actual name and price of item in cart
    var actualName = await this.page.$eval('.float-cart__shelf-container > .shelf-item > .shelf-item__details > .title',
        item => item.textContent);
    var actualPrice = await this.page.$eval('.float-cart__shelf-container > .shelf-item > .shelf-item__price > p',
        item => item.textContent);
    // Compare with name and price of item added to cart
    expect(actualName).to.equal(this.name);
    expect(actualPrice).to.contain(this.price);
});

When('I add one more of the item', async function () {
    // Add one more piece of an item
    await this.page.waitFor(250);
    const buttons = await this.page.$$('button.change-product-button');
    await buttons[1].click();
});

Then('I remove one piece of the item', async function () {
    // Remove one piece of an item
    await this.page.waitFor(250);
    const buttons = await this.page.$$('button.change-product-button');
    await buttons[0].click();
  });


Then('There is {string} of the item', async function (string) {
    // Check that there are correct amount of one item in cart
    var shirtQuantity = await this.page.$eval('.shelf-item__details > .desc', 
        item => item.textContent.split(" "));
    expect(shirtQuantity[shirtQuantity.length-1]).to.equal(string);
});

When('Click on Checkout', async function () {
    // Saves cart final price
    await this.page.waitFor(250);
    this.finalPrice = await this.page.$eval('.sub-price__val',
        item => item.textContent);
    // Click on checkout
    await this.page.click('.buy-btn');
});

Then('Checkout works', async function () {
    // Compare that price in checkout popup was same to price in cart
    expect(this.finalPrice).to.equal(this.dialogPrice);
});



