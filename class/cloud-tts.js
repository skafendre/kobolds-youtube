// TTS LIBRARIES
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');
const logger = require('./../scripts/logger');

// LOAD API REQUEST CONFIG FILE
const ttsConfig = require("./../config/tts_config");

class CloudTTS {
    constructor () {
        this.client = new textToSpeech.TextToSpeechClient({
            projectId: 'reddit-youtube-video-creator',
            keyFilename: 'gcloud_auth.json'
        });
        this.comments = {};
        this.dir = "";
    }

    async synthetizeArray (array) {
        array.forEach((comment, key) => {
            console.log(comment + " " + key);
            this.synthetize(comment, key);
        });
    }

    async synthetize (content, key) {
        const request = {
            input: {text: content},
            voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            audioConfig: {audioEncoding: 'MP3'},
        };

        // Performs the Text-to-Speech request
        const [response] = await this.client.synthesizeSpeech(request);

        // print
        const writeFile = util.promisify(fs.writeFile);
        await writeFile("assets/" + this.dir + "/" + "audio_" + key + ".mp3" , response.audioContent, 'binary');
        console.log('Audio content written to file: ');
    }
}

module.exports = CloudTTS;


