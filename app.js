const videoBuilder = require("./class/video-builder");
const logger = require("./scripts/logger");
require("./config/config");

console.log(global.gConfig);

//APP LAUNCH
logger.info("app launched");
const vBuilder = new videoBuilder();
vBuilder.buildVideo();





