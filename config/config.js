const _ = require('lodash');
const logger = require("./../scripts/logger");


// module variables
const config = require('./app-config.json');
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'development';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

logger.info("environment => " + environment);
// global namespace
global.gConfig = finalConfig;

