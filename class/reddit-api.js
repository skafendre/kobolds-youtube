'use strict';
require('dotenv').config();
const removeMd = require('remove-markdown');
const snoowrap = require('snoowrap');
const logger = require('./../scripts/logger');

class RedditThreadFetcher {
    constructor(subreddit) {
        this.r = new snoowrap({
            userAgent: 'Link with the Youtube channel content',
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            username: process.env.REDDIT_USER,
            password: process.env.REDDIT_PASS
        });
        this.settings = {subreddit: subreddit};
        this.videoContent = {};
    }

    async buildContent() {
        let sub = await this.r.getSubreddit(this.settings.subreddit).getTop({time: "day", limit: 1});
        await this.extractDataFromSubmission(sub);
    };

    async extractDataFromSubmission(submission) {
        this.videoContent.title = submission.map(s => s.title)[0];
        this.videoContent.id = submission.map(s => s.id)[0];

        // GET COMMENTS DATA
        let comments = await this.r.getSubmission(this.videoContent.id).comments.map(post => ({
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
        this.videoContent.comments = comments.filter(comment => comment.author !== "[deleted]" && comment.body !== "[removed]");
        this.videoContent.maxChar = this.videoContent.comments.reduce((acc, comment) => acc + comment.body.length, 0);

        // trying to log some stuff for winston
        logger.log("info", "Reddit thread info: ", {
            title: this.videoContent.title,
            id: this.videoContent.id,
            maxChar: this.videoContent.maxChar,
            commentsNb: this.videoContent.comments.length,
        })
    };

    cleanComment (comment) {
        return removeMd(comment.replace(/\n/g, '')).replace(/(?:https?|ftp):\/\/[\n\S]+/g, '');
    }
}

module.exports = RedditThreadFetcher;


