"use strict";
const fs = require("fs");
const logger = require("./../scripts/logger");

// CLASSES
const RedditThreadFetcher = require("./reddit-api");
const CloudTTS = require("./cloud-tts");
const CommentVisualCreator = require("./comment-visuals-creation");


class VideoBuilder {
    constructor () {
        this.reddit = new RedditThreadFetcher();
        this.cloudTTS = new CloudTTS();
        this.commentVisuals = new CommentVisualCreator();

        // gVideo regroup all the data for the video
        global.gVideo = {
            "id": "need db implementation",
            "threads" : [],
        };
    }

    async buildVideo() {
        // reddit
        await this.reddit.buildContent();

        // videos id && folder creation (need improvements.....)
        let videoId = gConfig.redditProfile.subreddit.toLowerCase() + "_" + gVideo.threads[gVideo.threads.length - 1].id;
        global.gAssetsPath = "assets/videos/" + videoId + "/";

        // create folder for assets
        !fs.existsSync(gAssetsPath) && fs.mkdirSync(gAssetsPath);
        let folderPath = gAssetsPath + this.reddit.threads[0].id;
        !fs.existsSync(folderPath) && fs.mkdirSync(folderPath);
        fs.existsSync(folderPath) ? logger.info("Created folder => " + folderPath) : logger.error("Could not create folder " + folderPath);

        // Cloud Text-to-Speech
        this.cloudTTS.thread = gVideo.threads[gI];
        await this.cloudTTS.synthetizeComments();

        // Visuals creation
        await this.commentVisuals.createVisuals();
    }
}

module.exports = VideoBuilder;