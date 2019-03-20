const videoBuilder = require("./class/video-builder");
const logger = require("./scripts/logger");
const redditProfiles = require("./config/reddit-profiles");
require("./config/config");

// initialize globals
gConfig.redditProfile = redditProfiles["dev"];
global.gI = 0; // global increment for multi rthreads
global.gVideo = {
    "id": "need db implementation",
    "threads" : [],
};

//APP LAUNCH
logger.info("app launched");
const vBuilder = new videoBuilder();
vBuilder.buildVideo();





