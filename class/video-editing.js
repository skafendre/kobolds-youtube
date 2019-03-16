const logger = require("./../scripts/logger");
const {PythonShell} = require("python-shell");
const path = require ("path");

class VideoEditing {
    constructor() {

    }

    compileVideo() {
        logger.info("Started compileVideo(), inside VideoEditing.");

        let pathPy = path.resolve ("..", "python-video-editing", "video-editing.py");
        logger.info("Run python script => " + pathPy);

        let pyshell = new PythonShell(pathPy);

        pyshell.on('message', function (message) {
            // received a message sent from the Python script (a simple "print" statement)
            logger.info(message);
        });

        // end the input stream and allow the process to exit
        pyshell.end(function (err,code,signal) {
            if (err) throw err;
            console.log('The exit code was: ' + code);
            console.log('The exit signal was: ' + signal);
        });
    }
}

module.exports = VideoEditing;