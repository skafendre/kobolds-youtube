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
    }

    async buildVideo() {
        // reddit
        this.reddit.setSettings("askreddit");
        await this.reddit.buildContent();
        this.id = this.reddit.settings.subreddit.toLowerCase() + "_" + this.reddit.redditContent.id;

        this.createFolder(this.id);

        // Cloud Text-to-Speech
        this.cloudTTS.comments = this.reddit.redditContent.comments.map(comment => comment.body);
        await this.cloudTTS.synthetizeComments();

        // Visuals creation
        let selectedComments = this.reddit.redditContent.comments.splice(0, this.cloudTTS.comments.length);
        logger.info("Size of comment array passed to Visuals Creation: " + selectedComments.length);
        this.commentVisuals.comments = selectedComments;

        await this.commentVisuals.createVisuals();
    }

    createFolder (id) {
        let path = "assets/thread/";
        !fs.existsSync(path + id) && fs.mkdirSync(path + id);

        // check if the folder has been properly created
        if (fs.existsSync(path + id)) {
            logger.info("Directory '" + id + "' created in " + path);
            this.cloudTTS.dir = id;
            this.commentVisuals.dir = id;
        } else {
            logger.error("Directory '" + id + "' has not been created");
            throw new Error('fatal error creation folder uncompleted');
        }
    }
}

module.exports = VideoBuilder;