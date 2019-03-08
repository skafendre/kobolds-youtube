"use strict";
const fs = require("fs");
const logger = require("./../scripts/logger");

// CLASSES
const RedditThreadFetcher = require("./reddit-api");
const CloudTTS = require("./cloud-tts");
const CommentVisualCreator = require("./comment-visualisation");


class VideoBuilder {
    constructor () {
        this.reddit = new RedditThreadFetcher("GoneWild");
        this.cloudTTS = new CloudTTS();
        this.commentVisuals = new CommentVisualCreator();
    }

    async buildVideo() {
        // reddit
        await this.reddit.buildContent();
        this.id = this.reddit.settings.subreddit.toLowerCase() + "_" + this.reddit.videoContent.id;

        this.createFolder(this.id);

        // Cloud Text-to-Speech
        this.cloudTTS.comments = this.reddit.videoContent.comments.map(comment => comment.body);
        await this.cloudTTS.synthetizeComments();
    }

    createFolder (dir) {
        let path = "assets/thread/";
        !fs.existsSync(path + dir) && fs.mkdirSync(path + dir);

        if (fs.existsSync(path + dir)) {
            logger.info("Directory '" + dir + "' created in " + path);
            this.cloudTTS.dir = dir;
            this.commentVisuals.dir = dir;
        } else {
            logger.error("Directory '" + dir + "' has not been created");
            throw new Error('fatal error creation folder uncompleted');
        }
    }
}

module.exports = VideoBuilder;