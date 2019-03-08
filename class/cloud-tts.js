// TTS LIBRARIES
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');
const logger = require('./../scripts/logger');
const config = require('./../config/app-config.json');

// LOAD API REQUEST CONFIG FILE
const ttsRequests = require("../config/tts-requests");

class CloudTTS {
    constructor () {
        this.client = new textToSpeech.TextToSpeechClient({
            projectId: 'reddit-youtube-video-creator',
            keyFilename: 'gcloud_auth.json'
        });
        this.comments = {};
        this.dir = "";
    }

    async synthetizeComments (array) {
        array.forEach((comment, key) => {
            console.log(comment + " " + key);
            this.synthetize(comment, key);
        });
    }

    async synthetize (content, key) {
        

        let fileOutput = "assets/thread/" + this.dir + "/" + "audio_" + key + ".mp3";

        if (fs.existsSync(fileOutput)) {
            logger.warn(fileOutput + " already exists, canceled synthetize() in cloud-tts.js");
            return;
        }

        const request = {
            input: {text: content},
            voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            audioConfig: {audioEncoding: 'MP3'},
        };

        // Performs the Text-to-Speech request
        const [response] = await this.client.synthesizeSpeech(request);
        const writeFile = util.promisify(fs.writeFile);
        await writeFile(fileOutput , response.audioContent, 'binary');

        if (fs.existsSync(fileOutput)) {
            logger.info(fileOutput + " written");
        } else {
            logger.error(fileOutput + " has not been written");
        }
    }
}

module.exports = CloudTTS;


