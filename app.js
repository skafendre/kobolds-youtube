"use strict";
let RedditThreadFetcher = require("./class/reddit-api");

async function buildVideo(subreddit) {
    let reddit = new RedditThreadFetcher("AskReddit");
    await reddit.buildContent();
}

buildVideo();