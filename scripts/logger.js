const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            level: process.env.WINSTON_LEVEL_CONSOLE,
            prettyPrint: true,
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ]
});

module.exports = logger;