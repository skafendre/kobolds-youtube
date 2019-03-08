"use strict";
const RedditThreadFetcher = require("./reddit-api");
const CloudTTS = require("./cloud-tts");
const fs = require("fs");

class VideoBuilder {
    constructor () {
        this.reddit = new RedditThreadFetcher("GoneWild");
        this.cloudTTS = new CloudTTS();
    }

    async buildVideo() {
        await this.reddit.buildContent();
        console.log(this.reddit.videoContent);
        console.log(this.reddit.videoContent.comments.length);

        this.id = this.reddit.settings.subreddit.toLowerCase() + "_" + this.reddit.videoContent.id;

        this.createFolder("assets/" + this.id);

        // await cloudTTS.testSynthetize();
    }

    async createFolder (dir) {
        !fs.existsSync(dir) && fs.mkdirSync(dir);
    }
}

module.exports = VideoBuilder;