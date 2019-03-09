const webshot = require('webshot');
const express = require('express');
const path = require("path");
const logger = require("./../scripts/logger");

var Users = {

    'David': {
        age: 52,
        occupation: 'Professor',
        hobby: 'Swimming'
    },
};


class CommentVisualsCreation {
    constructor () {
        this.dir = "";
        // this.comments = "";
        this.comments = [
            { id: 'ei49436',
            body: 'I thought it always was no panties season.',
            original_body: 'I thought it always was no panties season. ',
            author: 'AwhGz',
            edited: false,
            is_submitter: false,
            score: 61,
            gilded: 0,
            gildings: { gid_1: 0, gid_2: 0, gid_3: 0 },
            stickied: false,
            depth: 0 }
            ];
        this.app = express();
    }

    createVisuals () {
        logger.info("Started createVisuals() inside CommentVisualsCreation");
        // console.log(this.comments);
        console.log(CommentVisualsCreation.comments[0]);
    }

    startExpressServer () {
        // set server
        this.app.set('view engine', 'ejs');
        const port = 3000;

        this.app.use(express.static(path.resolve(__dirname)));

        // pass comments to /comments
        let comments = this.comments;
        this.app.get('/comments', function (req, res) {
            console.log(comments[0]);
            let check = comments[req.query.key];
            if (check) {
                res.render('comment', { key: req.query.key, info: check });
            } else {
                res.send('Nani ?!');
            }
        });

        // start server
        this.app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    }

    stopExpressServer () {
        // need to kill server
    }

    takeScreenshot () {
        let options = {
            screenSize: { width: 1920, height: 1080 },
            shotSize: { width: "all", height: "all" },
            errorIfJSException: "true",
        };

        webshot('google.com', 'google.png', options, function(err) {});
    }

}

test = new CommentVisualsCreation();
test.startExpressServer();

// test.takeScreenshot();

module.exports = CommentVisualsCreation;




