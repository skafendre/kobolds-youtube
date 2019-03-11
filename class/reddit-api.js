'use strict';
require('dotenv').config();
const removeMd = require('remove-markdown');
const snoowrap = require('snoowrap');
const logger = require('./../scripts/logger');
const redditSettings = require("../config/reddit-settings");

class RedditThreadFetcher {
    constructor() {
        // Build snoowrap client
        this.r = new snoowrap({
            userAgent: 'Link with the Youtube channel content',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            username: process.env.REDDIT_USER,
            password: process.env.REDDIT_PASS
        });

        this.threads = "";
    }

    // set settings configured in config/reddit-settings.json
    setSettings(settings) {
        this.settings = redditSettings[settings];
        logger.verbose("Settings profile '" + this.settings.subreddit + "'");
    }

    async fetchPotentialThread () {
        this.settings ? logger.verbose("Using settings => " + JSON.stringify(this.settings)) : logger.error("No settings found in reddit-api");

        // Fetch threads and filters them
        let threads = await this.r.getSubreddit(this.settings.subreddit).getTop({time: "week", limit: 100});
        let tFiltered = threads.filter(thread =>
            thread.is_self === true &&
            thread.pinned === false &&
            thread.over_18 === false &&
            thread.stickied === false &&
            thread.is_meta === false &&
            thread.quarantine === false &&
            thread.subreddit_type === "public" &&
            thread.spoiler === false &&
            thread.score > this.settings.minUp &&
            thread.num_comments > this.settings.minComments
        );

        this.threads = tFiltered;
        logger.verbose("threads length => " + threads.length + " && threads filtered => " + tFiltered.length);
    }

    async buildContent() {
        await this.fetchPotentialThread();

        await this.extractDataFromSubmission(this.threads[0]);
    };

    async extractDataFromSubmission(thread) {
        // GET COMMENTS DATA
        let comments = await this.r.getSubmission(thread.id).comments.map(post => ({
            id: post.id,
            body: this.cleanComment(post.body),
            original_body: post.body,
            author: post.author.name,
            edited: post.edited,
            is_submitter: post.is_submitter,
            score: post.score,
            gilded: post.gilded,
            gildings: post.gildings,
            stickied: post.stickied,
            depth: post.depth,
        }));

        // push videos info
        let threadToPush = {
            "id": thread.id,
            "title": thread.title,
            "author": thread.author.name,
            "comments": comments.filter(comment => comment.author !== "[deleted]" && comment.body !== "[removed]"),
            "char": comments.reduce((acc, comment) => acc + comment.body.length, 0),
        };
        
        gVideo.threads.push(threadToPush);

        // winston lloogogo
        logger.log("verbose", "Reddit videos info => ", {
            title: threadToPush.title,
            id: threadToPush.id,
            char: threadToPush.char,
            comments: threadToPush.length,
        })
    };

    // remove url, special char? (not sure), markdown
    cleanComment (comment) {
        return removeMd(comment.replace(/\n/g, '')).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    }
}

module.exports = RedditThreadFetcher;


