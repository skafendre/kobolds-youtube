const videoBuilder = require("./class/video-builder");
const logger = require("./scripts/logger");

const vBuilder = new videoBuilder();
vBuilder.buildVideo();
logger.info("app launched");


