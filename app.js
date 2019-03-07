"use strict";
const RedditThreadFetcher = require("./class/reddit-api");
const CloudTTS = require("./class/cloud-tts");

// Create video function
async function buildVideo() {
    let reddit = new RedditThreadFetcher("AskReddit");
    let cloudTTS = new CloudTTS();

    await reddit.buildContent();
    await cloudTTS.testSynthetize();

    console.log(reddit.videoContent.comments.length);
}

buildVideo();