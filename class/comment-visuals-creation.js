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
        logger.info("Started createVisuals() inside CommentVisualsCreation");

        const arrayToObject = (array) =>
            array.reduce((obj, item) => {
                obj[item.id] = item;
                return obj
            }, {});

        let json = JSON.stringify(arrayToObject(this.comments));

        // PATH TO THE VISUALS CREATOR JSON COMMENTS FILES
        let jsonPath = path.resolve(__dirname, "..", "..", "simple-visuals-creator", "comments.json");
        logger.verbose("Path to comments.json (visuals creation): " + jsonPath);

        // write json file and wait for promise
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(jsonPath, json);
        logger.info("Successfully written comment.json in " + jsonPath);

        // screencap comments
        await this.comments.forEach(comment => {
            let fileName =  + comment.id + ".png";
            webshot(
                'http://localhost:3000/visuals?key=' + comment.id,
                filePath,
                this.options,
                function (err) {
                });
            logger.info("Webshot capture started for: " + comment.id);
        });

        await this.comments.forEach(comment => {
            let filePath = "assets/videos/" + this.dir + "/" + this.dir + "img_" + comment.id + ".png";
            fs.existsSync(filePath) ? logger.info("Succesfuly created " + filePath) : logger.error("Could not create " + filePath);
        });
    }
}

module.exports = CommentVisualsCreation;




