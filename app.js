const videoBuilder = require("./class/video-builder");
const logger = require("./scripts/logger");
require("./config/config");

logger.info(global.gConfig);

//APP LAUNCH
const vBuilder = new videoBuilder();
vBuilder.buildVideo();

logger.info("app launched");



