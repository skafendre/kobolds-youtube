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
        this.comments = "";
        this.app = express();
    }

    createVisuals () {
        logger.info("Started createVisuals() inside CommentVisualsCreation");
        console.log(this.comments);
    }

    startExpressServer () {
        this.app.set('view engine', 'ejs');
        const port = 3000;

        this.app.get('/', (req, res) => res.send("hello"));

        this.app.get('/user', function (req, res) {
            let check = Users[req.query.name];
            if (check) {
                res.render('comment', { name: req.query.name, info: check });
            } else {
                res.send('Nani ?!');
            }
        });

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




