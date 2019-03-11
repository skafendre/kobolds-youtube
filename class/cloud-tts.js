// TTS LIBRARIES
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');
const logger = require('./../scripts/logger');
const gad = require("get-audio-duration");

// LOAD API REQUEST CONFIG FILE
const ttsRequests = require("../config/tts-requests");

class CloudTTS {
    constructor () {
        this.ttsClient = new textToSpeech.TextToSpeechClient({
            projectId: 'reddit-youtube-videos-creator',
            keyFilename: 'gcloud_auth.json'
        });
        this.thread = "";
        this.audioLength = 0;
    }

    async synthetizeComments () {
        logger.info("Starting audio synthesis of comments in CloudTTS synthetizeComments().");

        let i = 0;
        for (let comment of this.thread.comments) {
            await this.synthetize(comment.body, comment.id);
            i++;
            if (this.audioLength > gConfig.audio.targetLength) {
                break;
            }
        }

        gVideo.threads[gVideo.threads.length - 1].comments = gVideo.threads[gVideo.threads.length - 1].comments.slice(0, i);
        logger.verbose(gVideo.threads[gVideo.threads.length - 1].comments.length + " comments left after TTS audio conversion " + ", " + gConfig.audio.targetLength + " seconds reached.");
    }

    async synthetize (text, id) {
        let audioName = this.thread.id + "_" + id + ".mp3";
        let fileOutput = gAssetsPath + this.thread.id + "/" + audioName;

        if (fs.existsSync(fileOutput)) {
            await this.incrementAudioLength(fileOutput);
            logger.warn("Audio file already exist => " + fileOutput);
            return;
        }

        // Performs the Text-to-Speech request
        const request = {
            input: {text: text},
            voice: {languageCode: 'en-US', ssmlGender: 'FEMALE'},
            audioConfig: {audioEncoding: 'MP3'},
        };
        const [response] = await this.ttsClient.synthesizeSpeech(request);

        // Write file localy
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(fileOutput, response.audioContent, 'binary');

        // Check if the file has been written
        if (fs.existsSync(fileOutput)) {
            await this.incrementAudioLength(fileOutput);
            logger.info("Written audio file => " + fileOutput);
        } else {
            logger.error(fileOutput + " has not been written");
        }
    }

    async incrementAudioLength (fileOutput) {
        this.audioLength += await gad.getAudioDurationInSeconds(fileOutput);
        logger.verbose("Total comment audio length: " + this.audioLength);
    }
}

module.exports = CloudTTS;


