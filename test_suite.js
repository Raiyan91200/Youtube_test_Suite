const { Builder, By, Key, until } = require('selenium-webdriver');
const { expect } = require('chai');
const fs = require('fs');
const chrome = require('selenium-webdriver/chrome');

describe('YouTube Automated Test Suite', function () {
    this.timeout(60000);
    let driver;

    before(async function () {
        let options = new chrome.Options();
        options.addArguments("--start-maximized");
        options.addArguments("--mute-audio");


        driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });

    //test case 1 
    it('should perform a search and load video results', async function () {
        await driver.get('https://www.youtube.com');


        try {
            let consentButton = await driver.wait(
                until.elementLocated(By.xpath("//button[contains(@aria-label, 'Accept')] | //ytd-button-renderer//span[contains(text(), 'Accept all')]")),
                3000
            );
            await consentButton.click();
        } catch (e) {

        }

        let searchBox = await driver.wait(until.elementLocated(By.name('search_query')), 10000);
        await searchBox.sendKeys('Sustainable Industry Technology 5.0', Key.RETURN);

        await driver.wait(until.elementLocated(By.tagName('ytd-video-renderer')), 10000);

        let resultsLoaded = 0;
        let attempts = 0;
        while (resultsLoaded < 10 && attempts < 5) {
            await driver.executeScript("window.scrollTo(0, document.documentElement.scrollHeight);");
            await driver.sleep(1500);
            let elements = await driver.findElements(By.tagName('ytd-video-renderer'));
            resultsLoaded = elements.length;
            attempts++;
        }

        expect(resultsLoaded).to.be.at.least(5, 'Should load at least 5 video results');
    });

    //test case 2
    it('should find a video related to Green University of Bangladesh', async function () {

        let currentUrl = await driver.getCurrentUrl();
        if (!currentUrl.includes('search_query')) {
            await driver.get('https://www.youtube.com/results?search_query=Sustainable+Industry+Technology+5.0');
            await driver.wait(until.elementLocated(By.tagName('ytd-video-renderer')), 10000);
        }


        for (let i = 0; i < 3; i++) {
            await driver.executeScript("window.scrollBy(0, 800)");
            await driver.sleep(1000);
        }

        let results = await driver.findElements(By.tagName('ytd-video-renderer'));
        let found = false;
        let limit = Math.min(results.length, 30);

        console.log(`    Checking ${limit} results for GUB content...`);

        for (let i = 0; i < limit; i++) {
            let item = results[i];
            let title = await item.findElement(By.id('video-title')).getText().catch(() => "");

            let channel = "";
            try {
                let channelElem = await item.findElement(By.css('#channel-info #text'));
                channel = await channelElem.getText();
            } catch (e) { channel = "Unknown"; }

            let desc = "";
            try {
                let descElem = await item.findElement(By.css('#description-text'));
                desc = await descElem.getText();
            } catch (e) { desc = ""; }

            let fullText = (title + " " + channel + " " + desc).toLowerCase();

            if (fullText.includes("green university of bangladesh") || fullText.includes("gub")) {
                found = true;
                break;
            }
        }

        expect(found, 'Could not find video related to Green University of Bangladesh or GUB').to.be.true;
    });

    //test case 3
    it('should have valid thumbnails', async function () {

        for (let i = 0; i < 3; i++) {
            await driver.executeScript("window.scrollBy(0, 800)");
            await driver.sleep(1500);
        }

        let images = await driver.findElements(By.css("ytd-video-renderer #thumbnail img"));
        let checkedCount = 0;
        let brokenCount = 0;
        let brokenUrls = [];
        let limit = 20;

        console.log("    Validating thumbnails...");

        for (let img of images) {
            if (checkedCount >= limit) break;

            let src = await img.getAttribute("src");
            if (!src) continue;

            let isBroken = false;
            
            let naturalWidth = await driver.executeScript("return arguments[0].naturalWidth", img);
            if (naturalWidth <= 0) isBroken = true;


            if (!isBroken) {
                try {
                    const response = await fetch(src, { method: 'HEAD' });
                    if (response.status !== 200) isBroken = true;
                } catch (err) {
                    isBroken = true;
                }
            }

            if (isBroken) {
                brokenCount++;
                if (brokenUrls.length < 5) brokenUrls.push(src);
            }
            checkedCount++;
        }

        if (brokenCount > 0) {
            let encodedString = await driver.takeScreenshot();
            fs.writeFileSync('broken_thumbnails_suite_failure.png', encodedString, 'base64');
        }

        expect(brokenCount, `Found ${brokenCount} broken thumbnails`).to.equal(0);
    });
});
