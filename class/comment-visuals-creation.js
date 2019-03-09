const webshot = require('webshot');
const express = require('express');
const path = require("path");

class CommentVisualsCreation {
    constructor () {
        this.dir = "";
    }

    startExpressServer () {
        const app = express();
        const port = 3000;

        app.get('/', (req, res) => res.sendFile(path.resolve(__dirname, '..', 'html', 'comment-visualisation.html')));
        app.listen(port, () => console.log(`Example app listening on port ${port}!`));
    }

    takeScreenshot () {
        let options = {
            screenSize: { width: 1920, height: 1080 },
            shotSize: { width: "all", height: "all" },
            errorIfJSException: "true",
        };

        webshot(this.dir + 'google.com', 'google.png', options, function(err) {
            // screenshot now saved to google.png
        });
    }

    appendToHtml () {

    }
}

// test = new CommentVisualsCreation();
// test.startExpressServer();
// test.appendToHtml();
// test.takeScreenshot();

module.exports = CommentVisualsCreation;




