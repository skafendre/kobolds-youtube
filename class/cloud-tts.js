// TTS LIBRARIES
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');
const logger = require('./../scripts/logger');
const gad = require("get-audio-duration");

class CloudTTS {
    constructor () {
        this.ttsClient = new textToSpeech.TextToSpeechClient({
            projectId: 'reddit-youtube-videos-creator',
            keyFilename: 'gcloud_auth.json'
        });
        this.audioLength = 0;
    }

    async synthetizeThread () {
        logger.info("Starting audio synthesis of comments in CloudTTS synthetizeComments()");

        await this.synthetizeTitle(gVideo.threads[gI].title);

        // Comments
        let i = 0;
        for (let comment of gVideo.threads[gI].comments) {
            let cleanCom = comment.body.replace(/\n\n/g, '. ').replace(/&#x200B;/g, "");

            (cleanCom.length >= 2500) ?
                await this.synthetizeLong(cleanCom, comment.id) :
                await this.synthetizeComment(cleanCom, comment.id);

            i++;
            if (this.audioLength > gConfig.audio.targetLength || i >= gConfig.redditProfile.commentsPerThread) {
                break;
            }
        }

        // slice unused comments + logging
        gVideo.threads[gI].comments = gVideo.threads[gI].comments.slice(0, i);
        logger.info("Reached audio length of => " + this.audioLength + ". Target audio length was => " + gConfig.audio.targetLength );
        logger.info("Reached comments nb => " + i + ". Max comments /thread was => " + gConfig.redditProfile.commentsPerThread);
        logger.verbose(gVideo.threads[gI].comments.length + " comments left after TTS audio conversion");
    }

    async synthetizeTitle (text) {
        let audioName = gVideo.threads[gI].id + "_title.mp3";
        let fileOutput = gAssetsPath + gVideo.threads[gI].id + "/" + audioName;
        await this.synthetize(text, fileOutput);

        gVideo.threads[gI].titleAssets = {
            audio: audioName
        };
    }

    async synthetizeLong (text, id) {
        logger.info("Synthetize long => " + id);

        let sentences = text.split(".").filter(sentence => sentence !== "");
        let commentsParts = [];

        let acc = 0;
        let lastCut = 0;
        for (let i = 0; i < sentences.length; i++) {
            acc += sentences[i].length;

            if (acc >= 1500) {
                commentsParts.push(sentences.slice(lastCut, i).reduce((acc, val) => acc + "." +  val).trim());
                acc = sentences[i].length;
                lastCut = i;
            }
        }
        // push leftovers
        commentsParts.push(sentences.slice(lastCut, sentences.length).reduce((acc, val) => acc + "." +  val).trim());

        let index = 0;
        for (let part of commentsParts) {
            let audioName = gVideo.threads[gI].id + "_" + id + "_part_" + index + ".mp3";
            let fileOutput = gAssetsPath + gVideo.threads[gI].id + "/" + audioName;

            await this.synthetize(part, fileOutput);
            this.setFileName(id, audioName);

            logger.verbose("Comment " + id + " part " + index + " => " + part.length + " characters");
            index++;
        }
    }

     setFileName (id, audioName) {
        if (gVideo.threads[gI].comments.find(comment => comment.id === id).audio === undefined) {
            gVideo.threads[gI].comments.find(comment => comment.id === id).audio = [];
        }

        gVideo.threads[gI].comments.find(comment => comment.id === id).audio.push(audioName);
    }

    async synthetizeComment (text, id) {
        let audioName = gVideo.threads[gI].id + "_" + id + ".mp3";
        let fileOutput = gAssetsPath + gVideo.threads[gI].id + "/" + audioName;

        await this.synthetize(text, fileOutput);
        this.setFileName(id, audioName);
    }

    async synthetize (text, filePath) {
        if (!fs.existsSync(filePath)) {
            // Performs the Text-to-Speech request
            const request = {
                input: {text: text},
                voice: {languageCode: 'en-US', name: gConfig.redditProfile.voice},
                audioConfig: {audioEncoding: 'LINEAR16'},
            };
            const [response] = await this.ttsClient.synthesizeSpeech(request).catch(err => {
                logger.error("Error Cloud TTS API => " + err.details);
                process.exit(10);
            });

            // Write file locally
            const writeFile = util.promisify(fs.writeFile);
            await writeFile(filePath, response.audioContent, 'binary');
        }

        await this.incrementAudioLength(filePath);
        (fs.existsSync(filePath)) ? logger.info("Written audio file => " + filePath) : logger.error("ERROR AUDIO FILE NOT WRITTEN");
    }


    async incrementAudioLength (fileOutput) {
        this.audioLength += await gad.getAudioDurationInSeconds(fileOutput);
        logger.verbose("Total comment audio length: " + this.audioLength);
    }
}

module.exports = CloudTTS;


