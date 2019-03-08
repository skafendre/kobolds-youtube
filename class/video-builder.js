"use strict";
const RedditThreadFetcher = require("./reddit-api");
const CloudTTS = require("./cloud-tts");
const fs = require("fs");
const logger = require("./../scripts/logger");

class VideoBuilder {
    constructor () {
        this.reddit = new RedditThreadFetcher("Touhou");
        this.cloudTTS = new CloudTTS();
    }

    async buildVideo() {
        // reddit
        await this.reddit.buildContent();
        this.id = this.reddit.settings.subreddit.toLowerCase() + "_" + this.reddit.videoContent.id;

        this.createFolder(this.id);

        // Cloud Text-to-Speech
        await this.cloudTTS.synthetizeArray(this.reddit.videoContent.comments.map(comment => comment.body));
        // await this.cloudTTS.testSynthetize();
    }

    createFolder (dir) {
        !fs.existsSync("assets/" + dir) && fs.mkdirSync("assets/" + dir);

        if (fs.existsSync("assets/" + dir)) {
            logger.info("Directory '" + dir + "' created in /assets");
            this.cloudTTS.dir = dir;
        } else {
            logger.error("Directory '" + dir + "' has not been created");
            throw new Error('listId does not exist');
        }
    }
}

module.exports = VideoBuilder;