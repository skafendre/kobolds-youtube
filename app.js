const videoBuilder = require("./class/video-builder");
const logger = require("./scripts/logger");
const redditProfiles = require("./config/reddit-profiles");
require("./config/config");

gConfig.redditProfile = redditProfiles["askreddit"];
global.gI = 0;

//APP LAUNCH
logger.info("app launched");
const vBuilder = new videoBuilder();
vBuilder.buildVideo();





