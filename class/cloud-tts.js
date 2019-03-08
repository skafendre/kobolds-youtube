// TTS LIBRARIES
const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');
// LOAD API REQUEST CONFIG FILE
const ttsConfig = require("./../config/tts_config");

class CloudTTS {
    constructor () {
        this.client = new textToSpeech.TextToSpeechClient({
            projectId: 'reddit-youtube-video-creator',
            keyFilename: 'gcloud_auth.json'
        });
    }

    async testSynthetize () {
        const text = 'Hello, world!';

        const request = {
            input: {text: text},
            voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            audioConfig: {audioEncoding: 'MP3'},
        };

        // Performs the Text-to-Speech request
        const [response] = await this.client.synthesizeSpeech(request);
        this.printAudio(response);
    }

    async printAudio (audio) {
        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        await writeFile('output.mp3', audio.audioContent, 'binary');
        console.log('Audio content written to file: ');
    }
}

module.exports = CloudTTS;


