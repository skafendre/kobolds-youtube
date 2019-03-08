"use strict";
const RedditThreadFetcher = require("./class/reddit-api");
const CloudTTS = require("./class/cloud-tts");
const fs = require("fs");

class VideoBuilder {
    constructor () {

    }

    async buildVideo() {
        let reddit = new RedditThreadFetcher("GoneWild");
        let cloudTTS = new CloudTTS();

        await reddit.buildContent();
        console.log(reddit.videoContent);
        console.log(reddit.videoContent.comments.length);

        // await cloudTTS.testSynthetize();
    }

// async function createFolder (dir) {
//     !fs.existsSync(dir) && fs.mkdirSync(dir);
// }
}

module.exports = VideoBuilder;