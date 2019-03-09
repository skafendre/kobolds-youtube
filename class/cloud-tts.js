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
            projectId: 'reddit-youtube-video-creator',
            keyFilename: 'gcloud_auth.json'
        });
        this.comments = [];
        this.dir = "";
        this.audioLength = 0;
    }

    async synthetizeComments () {
        let i = 0;
        for (let comment of this.comments) {
            await this.synthetize(comment, i);
            i++;
            if (this.audioLength > gConfig.audio.targetLength) {
                break;
            }
        }

        this.comments = this.comments.slice(0, i);
        logger.info(this.comments.length + " comments left after TTS audio conversion " + ", " + gConfig.audio.targetLength + " seconds reached.");
    }

    async synthetize (content, key) {
        // console.log(gConfig.audio.target_length);

        let fileOutput = "assets/thread/" + this.dir + "/" + this.dir + "_audio_" + key + ".mp3";

        if (fs.existsSync(fileOutput)) {
            await this.incrementAudioLength(fileOutput);
            logger.warn(fileOutput + " already exists, cancelled synthetize() in cloud-tts.js");
            return;
        }

        // Performs the Text-to-Speech request
        const request = {
            input: {text: content},
            voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            audioConfig: {audioEncoding: 'MP3'},
        };
        const [response] = await this.ttsClient.synthesizeSpeech(request);

        // Write file localy
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(fileOutput, response.audioContent, 'binary');

        // Check if the file has been written
        if (fs.existsSync(fileOutput)) {
            await this.incrementAudioLength(fileOutput);
            logger.info(fileOutput + " written");
        } else {
            logger.error(fileOutput + " has not been written");
        }
    }

    async incrementAudioLength (fileOutput) {
        this.audioLength += await gad.getAudioDurationInSeconds(fileOutput);
        logger.info("Total comment audio length: " + this.audioLength);
    }
}

module.exports = CloudTTS;


