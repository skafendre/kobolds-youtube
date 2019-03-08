"use strict";
const RedditThreadFetcher = require("./reddit-api");
const CloudTTS = require("./cloud-tts");
const fs = require("fs");
const logger = require("./../scripts/logger");

class VideoBuilder {
    constructor () {
        this.reddit = new RedditThreadFetcher("GoneWild");
        this.cloudTTS = new CloudTTS();
    }

    async buildVideo() {
        // reddit
        await this.reddit.buildContent();
        this.id = this.reddit.settings.subreddit.toLowerCase() + "_" + this.reddit.videoContent.id;

        this.createFolder(this.id);

        // Cloud Text-to-Speech
        // await cloudTTS.testSynthetize();
    }

    createFolder (dir) {
        !fs.existsSync("assets/" + dir) && fs.mkdirSync("assets/" + dir);
        fs.existsSync("assets/" + dir) ?
            logger.info("Directory '" + dir + "' created in /assets") :
            logger.error("Directory '" + dir + "' has not been created");
    }
}

module.exports = VideoBuilder;