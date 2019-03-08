const webshot = require('webshot');

class CommentVisualsCreator {
    constructor () {
        this.dir = "";
    }

    createVisuals () {
        let options = {
            screenSize: { width: 1920, height: 1080 },
            shotSize: { width: "all", height: "all" },
            errorIfJSException: "true",
        };

        webshot(this.dir + 'google.com', 'google.png', options, function(err) {
            // screenshot now saved to google.png
        });
    }

}



test = new CommentVisualsCreator();
test.createVisuals();

module.exports = CommentVisualsCreator;




