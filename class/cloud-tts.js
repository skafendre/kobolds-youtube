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

    async synthetizeComments () {
        logger.info("Starting audio synthesis of comments in CloudTTS synthetizeComments()");

        // Title
        await this.synthetize(gVideo.threads[gI].title, "title");

        // Comments
        let i = 0;
        for (let comment of gVideo.threads[gI].comments) {
            let cleanCom = comment.body.replace(/\n\n/g, '. ').replace(/&#x200B;/g, "");

            (cleanCom.length >= 2500) ?
                await this.synthetizeLong(cleanCom, comment.id) :
                await this.synthetize(cleanCom, comment.id);

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

    async synthetizeLong (text, id) {
        logger.info("Synthetize long => " + id);

        let sentences = text.split(".").filter(sentence => sentence !== "");
        let commentsParts = [];
        console.log(sentences);

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

        commentsParts.push(sentences.slice(lastCut, sentences.length).reduce((acc, val) => acc + "." +  val).trim());

        console.log(commentsParts);


        let index = 0;
        for (let part of commentsParts) {
            logger.verbose("Comment " + id + " part " + index + " => " + part.length + " characters");
            await this.synthetize(part, id + "_part" + index + "_" + part.length);
            index++;
        }
    }

    async synthetize (text, fileName) {
        let audioName = gVideo.threads[gI].id + "_" + fileName + ".mp3";
        let fileOutput = gAssetsPath + gVideo.threads[gI].id + "/" + audioName;

        if (fs.existsSync(fileOutput)) {
            await this.checkFile("warn", fileOutput);
            return;
        }

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

        // Write file localy
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(fileOutput, response.audioContent, 'binary');

        // Check if the file has been written
        if (fs.existsSync(fileOutput)) {
            await this.checkFile("info", fileOutput);
        } else {
            logger.error(fileOutput + " has not been written");
        }
    }

    async checkFile (level, fileOutput) {
        level === "info" ? logger.info("Written audio file => " + fileOutput) : logger.warn("Audio file already exist => " + fileOutput);
        await this.incrementAudioLength(fileOutput);
    }

    async incrementAudioLength (fileOutput) {
        this.audioLength += await gad.getAudioDurationInSeconds(fileOutput);
        logger.verbose("Total comment audio length: " + this.audioLength);
    }
}

module.exports = CloudTTS;


