"use strict";
let RedditThreadFetcher = require("./class/reddit-api");


async function buildVideo() {
    let reddit = new RedditThreadFetcher("AskReddit");
    await reddit.buildContent();

    console.log(reddit.videoContent.comments.length);
}

buildVideo();