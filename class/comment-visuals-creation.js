const webshot = require('webshot');
const logger = require("./../scripts/logger");
const fs = require("fs");
const util = require('util');

class CommentVisualsCreation {
    constructor () {
        this.options = {
            screenSize: {width: 1920, height: 1080},
            shotSize: {width: 1920, height: 1080},
            errorIfJSException: true,
            quality: 150,
            errorIfStatusIsNot200: true
        };
    }

    async createVisuals () {
        logger.info("Started Visuals creation");

        await this.linkWithExpressRendering();

        await this.takeWebshots()
    }

    async takeWebshots () {
        // promisify webshot
        const webshotPromise = async (html, screenPath, options) =>
            new Promise((resolve, reject) => {
                webshot(html, screenPath, options, e => (!e ? resolve(screenPath) : reject(e)));
            });

        let promises = [];

        // title
        promises.push(webshotPromise(
            'http://localhost:3000/thread' ,
            gAssetsPath + gVideo.threads[gI].id + "/" + gVideo.threads[gI].id + "_title.png",
            this.options,
        ));

        // comments
        let i = 0;
        await gVideo.threads[gI].comments.forEach(comment => {
            promises.push(webshotPromise(
                'http://localhost:3000/comment?id=' + comment.id,
                gAssetsPath + gVideo.threads[gI].id + "/" + gVideo.threads[gI].id + "_" + comment.id + ".png",
                this.options,
            ));
            i++
        });

        await Promise.all(promises).then((responses) => {
            promises.length !== responses.length ?
                logger.error("Took " + responses.length + "/" + promises.length + " webshots.") :
                logger.info("Took " + responses.length + "/" + promises.length + " webshots.") ;
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




