const logger = require("./../scripts/logger");
const fs = require("fs");
const util = require('util');
const puppeteer = require("puppeteer");


class CommentVisualsCreation {
    constructor () {
        this.options = {
            screenSize: {width: 1920, height: 1080},
            shotSize: {width: 1920, height: 1080},
            errorIfJSException: true,
            quality: 150,
            errorIfStatusIsNot200: true
        };
        this.promises = [];
    }

    async startPuppeteer() {
        this.browser = await puppeteer.launch();
    }

    async createVisuals () {
        logger.info("Started Visuals creation");

        await this.linkWithExpressRendering();

        await this.takeScreenshots();
    }

    async takeScreenshots () {
        await this.startPuppeteer();

        //title
        await this.screenshot("thread", gAssetsPath + gVideo.threads[gI].id + "/" + gVideo.threads[gI].id + "_title.png");

        // comments
        for (let comment of gVideo.threads[gI].comments) {
            let path = gAssetsPath + gVideo.threads[gI].id + "/" + gVideo.threads[gI].id + "_" + comment.id + ".png";
            await this.screenshot("comment?id=" + comment.id, path);
        }

        await Promise.all(this.promises).then((test =>
            logger.info("Taken screenhot succefully")
        )).catch(err =>
            logger.error("Error screenshots => " + err)
        );

        this.browser.close();
    }

    async screenshot (target, path) {
        const page = await this.browser.newPage();
        await page.goto('http://localhost:3000/' + target);
        await page.setViewport({width: 1920, height: 1080});

        this.promises.push(page.screenshot({path: path})
            .then(await console.log("Written file to => " + path))
        );
    }

    async linkWithExpressRendering () {
        let json = JSON.stringify(gVideo.threads[gI]);

        // write json file and wait for promise
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(gConfig.path.visuals, json);
        logger.info("Successfully written in thread.json in " + gConfig.path.visuals);
    }
}

module.exports = CommentVisualsCreation;




