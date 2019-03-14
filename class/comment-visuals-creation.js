const webshot = require('webshot');
const logger = require("./../scripts/logger");
const fs = require("fs");
const path = require("path");
const util = require('util');

class CommentVisualsCreation {
    constructor () {
        this.options = {
            screenSize: { width: 1920, height: 1080 },
            shotSize: { width: 1920, height: 1080 },
            errorIfJSException: true,
            quality: 150,
            errorIfStatusIsNot200: true
        };
    }

    async createVisuals () {
        logger.info("Started Visuals creation");

        await this.linkWithExpressRendering();

        // screencap thread title
        webshot(
            'http://localhost:3000/thread' ,
            gAssetsPath + gVideo.threads[gI].id + "/" + gVideo.threads[gI].id + "_title.png",
            this.options,
            function (err) {
                if (err) {
                    logger.error("Webshot Error.");
                }
            }
        );

        // screencap comments
        let i = 0;
        await gVideo.threads[gI].comments.forEach(comment => {
            let fileName = gVideo.threads[gI].id + "_" + comment.id + ".png";
            webshot(
                'http://localhost:3000/comment?id=' + i,
                gAssetsPath + gVideo.threads[gI].id + "/" + fileName,
                this.options,
                function (err) {
                    if (err) {
                        logger.error("Webshot Error.");
                        process.exit(1);
                    } else {
                        logger.info("Successfully created => " + gAssetsPath + gVideo.threads[gI].id + fileName);
                    }
                });
            i++;
        });
    }

    // might now work
    async linkWithExpressRendering () {
        let json = JSON.stringify(gVideo.threads[gI]);

        // write json file and wait for promise
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(gConfig.path.visuals, json);
        logger.info("Successfully written in thread.json in " + gConfig.path.visuals);
    }
}

module.exports = CommentVisualsCreation;




