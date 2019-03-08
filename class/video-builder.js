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
        await this.cloudTTS.synthetizeComments(this.reddit.videoContent.comments.map(comment => comment.body));
    }

    createFolder (dir) {
        let path = "assets/thread/";
        !fs.existsSync(path + dir) && fs.mkdirSync(path + dir);

        if (fs.existsSync(path + dir)) {
            logger.info("Directory '" + dir + "' created in " + path);
            this.cloudTTS.dir = dir;
        } else {
            logger.error("Directory '" + dir + "' has not been created");
            throw new Error('fatal error creation folder uncompleted');
        }
    }
}

module.exports = VideoBuilder;