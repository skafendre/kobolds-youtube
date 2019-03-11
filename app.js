const videoBuilder = require("./class/video-builder");
const logger = require("./scripts/logger");
require("./config/config");

gConfig.profile = "askreddit";
global.gI = 0;

//APP LAUNCH
logger.info("app launched");
const vBuilder = new videoBuilder();
vBuilder.buildVideo();





