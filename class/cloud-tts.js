const fs = require('fs');
const util = require('util');
const textToSpeech = require('@google-cloud/text-to-speech');

class CloudTTS {
    constructor () {
        this.client = new textToSpeech.TextToSpeechClient();
    }
    
    async testSynthetize () {
        // The text to synthesize
        const text = 'Hello, world!';

        // Construct the request
        const request = {
            input: {text: text},
            // Select the language and SSML Voice Gender (optional)
            voice: {languageCode: 'en-US', ssmlGender: 'NEUTRAL'},
            // Select the type of audio encoding
            audioConfig: {audioEncoding: 'MP3'},
        };

        // Performs the Text-to-Speech request
        const [response] = await this.client.synthesizeSpeech(request);

        // Write the binary audio content to a local file
        const writeFile = util.promisify(fs.writeFile);
        await writeFile('output.mp3', response.audioContent, 'binary');
        console.log('Audio content written to file: ');
    }
}

module.exports = CloudTTS;


