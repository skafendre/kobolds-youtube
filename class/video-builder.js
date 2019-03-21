"use strict";
const fs = require("fs");
const logger = require("./../scripts/logger");
const util = require("util");
const path = require("path");

// CLASSES
const RedditThreadFetcher = require("./reddit-api");
const CloudTTS = require("./cloud-tts");
const CommentVisualCreator = require("./comment-visuals-creation");
const VideoEditing = require("./video-editing");

class VideoBuilder {
    constructor () {
        this.reddit = new RedditThreadFetcher();
        this.cloudTTS = new CloudTTS();
        this.commentVisuals = new CommentVisualCreator();
        this.videoEditing = new VideoEditing();
    }

    async buildVideo() {
        // reddit
        await this.reddit.buildContent();

        // videos id
        let videoId = gConfig.redditProfile.subreddit.toLowerCase() + "_" + gVideo.threads[gVideo.threads.length - 1].id;
        global.gAssetsPath = "assets/videos/" + videoId + "/";

        // create folder for assets
        !fs.existsSync(gAssetsPath) && fs.mkdirSync(gAssetsPath);
        let folderPath = gAssetsPath + this.reddit.threads[0].id;
        !fs.existsSync(folderPath) && fs.mkdirSync(folderPath);
        fs.existsSync(folderPath) ? logger.info("Created folder => " + folderPath) : logger.error("Could not create folder " + folderPath);

        // Cloud Text-to-Speech
        this.cloudTTS.thread = gVideo.threads[gI];
        await this.cloudTTS.synthetizeThread();

        // Visuals creation
        await this.commentVisuals.createVisuals();

        // Video editing
        await this.linkWithVideoEditing();
        this.videoEditing.compileVideo();
    }

    async linkWithVideoEditing () {
        // simplify threads and passed it to video-editing.
        let simplifiedThreads = gVideo.threads.map(thread => ({
            id: thread.id,
            title_assets: {
              img: thread.id + "_title.png",
              audio: thread.titleAssets.audio,
            },
            music: gConfig.redditProfile.music,
            dir: path.resolve(__dirname, "..", gAssetsPath, gVideo.threads[gI].id),
            comments: thread.comments.map(comment => ({
                id: thread.id + "_" + comment.id,
                audio: comment.audio,
            }))
        }));

        console.log(simplifiedThreads);

        let json = JSON.stringify(simplifiedThreads);

        // write json file and wait for promise
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(gConfig.path.video, json, function(err){
            err ? console.log(err) : logger.info("Successfully written in video.json in " + gConfig.path.video);
        });
    }
}

module.exports = VideoBuilder;