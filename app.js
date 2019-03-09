const videoBuilder = require("./class/video-builder");
const logger = require("./scripts/logger");
require("./config/config");

logger.info(global.gConfig);

//APP LAUNCH
logger.info("app launched");
const vBuilder = new videoBuilder();
vBuilder.buildVideo();





