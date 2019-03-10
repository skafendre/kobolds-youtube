const webshot = require('webshot');
const logger = require("./../scripts/logger");
const fs = require("fs");
const path = require("path");

class CommentVisualsCreation {
    constructor () {
        this.options = {
            screenSize: { width: 1920, height: 1080 },
            shotSize: { width: 1920, height: 1080 },
            errorIfJSException: "true",
        };
        this.dir = "";
        this.comments = "";
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
        logger.debug("Path to comments.json (visuals creation): " + jsonPath);
        await fs.writeFile(jsonPath, json, (err) => {
            if (err) {
                logger.error(err);
            } else {
                logger.info("JSON successfully written to file");
            }
        });

        this.comments.forEach(comment => {
            let filePath = "assets/thread/" + this.dir + "/" + this.dir + "img_" + comment.id + ".png";
            webshot(
                'http://localhost:3000/visuals?key=' + comment.id,
                filePath,
                this.options,
                function (err) {
                    //traitement errur
                });
            fs.existsSync(filePath) ? logger.info("Succesfuly created " + filePath) : logger.error("Could not create " + filePath);
        });
        // webshot('http://localhost:3000/visuals?key=0', "assets/thread/" + this.dir + "/" + this.dir + "img_number.png" , this.options, function(err) {
        //     console.log(err);
        // });
    }
}

module.exports = CommentVisualsCreation;




