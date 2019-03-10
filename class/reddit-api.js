'use strict';
require('dotenv').config();
const removeMd = require('remove-markdown');
const snoowrap = require('snoowrap');
const logger = require('./../scripts/logger');
const redditSettings = require("../config/reddit-settings");

class RedditThreadFetcher {
    constructor(settings) {
        // Build snoowrap client
        this.r = new snoowrap({
            userAgent: 'Link with the Youtube channel content',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            username: process.env.REDDIT_USER,
            password: process.env.REDDIT_PASS
        });

        this.redditContent = {};
    }

    // set settings configured in config/reddit-settings.json
    setSettings(settings) {
        this.settings = redditSettings[settings];
        logger.verbose("Settings used => " + JSON.stringify(this.settings));
    }

    async buildContent() {
        let sub = await this.r.getSubreddit(this.settings.subreddit).getTop({time: "day", limit: 1});
        await this.extractDataFromSubmission(sub);
    };

    async extractDataFromSubmission(submission) {
        this.redditContent.title = submission.map(s => s.title)[0];
        this.redditContent.id = submission.map(s => s.id)[0];

        // GET COMMENTS DATA
        let comments = await this.r.getSubmission(this.redditContent.id).comments.map(post => ({
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


        // remove useless stuff
        this.redditContent.comments = comments.filter(comment => comment.author !== "[deleted]" && comment.body !== "[removed]");
        this.redditContent.maxChar = this.redditContent.comments.reduce((acc, comment) => acc + comment.body.length, 0);

        // trying to log some stuff for winston
        logger.log("verbose", "Reddit thread info => ", {
            title: this.redditContent.title,
            id: this.redditContent.id,
            maxChar: this.redditContent.maxChar,
            commentsNb: this.redditContent.comments.length,
        })
    };

    cleanComment (comment) {
        return removeMd(comment.replace(/\n/g, '')).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    }
}

module.exports = RedditThreadFetcher;


