'use strict';
require('dotenv').config();
const removeMd = require('remove-markdown');
const snoowrap = require('snoowrap');
const logger = require('./../scripts/logger');

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

        logger.verbose("Settings profile '" + gConfig.redditProfile.subreddit + "'");

        this.threads = "";
    }

    async fetchPotentialThread () {
        gConfig.redditProfile ? logger.verbose("Using settings => " + JSON.stringify(gConfig.redditProfile)) : logger.error("No settings found in reddit-api");

        // Fetch threads and filters them
        let threads = await this.r.getSubreddit(gConfig.redditProfile.subreddit).getTop({time: "daily", limit: 100});
        let tFiltered = threads.filter(thread =>
            thread.is_self === true &&
            thread.pinned === false &&
            thread.over_18 === false &&
            thread.stickied === false &&
            thread.is_meta === false &&
            thread.quarantine === false &&
            thread.subreddit_type === "public" &&
            thread.spoiler === false &&
            thread.score > gConfig.redditProfile.minUp &&
            thread.num_comments > gConfig.redditProfile.minComments
        );

        this.threads = tFiltered; // threads that passed all the filters
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
            htmlBody: post.body_html,
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

        // some logging
        logger.log("verbose", "Reddit videos info => \n", {
            title: threadToPush.title,
            id: threadToPush.id,
            char: threadToPush.char,
            comments: threadToPush.length,
        })
    };

    // remove url, special char? (not sure), markdown
    cleanComment (comment) {
        comment = removeMd(comment);
        return comment.replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    }
}

module.exports = RedditThreadFetcher;


