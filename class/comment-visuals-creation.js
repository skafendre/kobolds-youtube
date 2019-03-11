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

        // screencap comments
        await gVideo.threads[gI].comments.forEach(comment => {
            let fileName = gVideo.threads[gI].id + "_" + comment.id + ".png";
            console.log(gAssetsPath + gVideo.threads[gI].id + fileName);
            webshot(
                'google.com' ,
                gAssetsPath + gVideo.threads[gI].id + "/" + fileName,
                this.options,
                function (err) {
                    if (err) {
                        logger.error("Webshot Error.");
                    }
                });
        });

        await gVideo.threads[gI].comments.forEach(comment => {
            let fileName = comment.id + ".png";
            fs.existsSync(gAssetsPath + fileName) ? logger.info("Succesfuly created " + fileName) : logger.error("Could not create " + fileName);
        });
    }

    // might now work
    async linkWithExpressRendering () {
        // Link with express rendering
        let json = JSON.stringify(gVideo.threads[gI]); // not working for now
        let jsonPath = path.resolve(__dirname, "..", "..", "simple-visuals-creator", "comments.json");
        logger.verbose("Path to comments.json (visuals creation): " + jsonPath);

        // write json file and wait for promise
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(jsonPath, json);
        logger.info("Successfully written comment.json in " + jsonPath);
    }
}

module.exports = CommentVisualsCreation;




