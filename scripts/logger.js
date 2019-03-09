const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            ),
            level: process.env.WINSTON_LEVEL_CONSOLE,
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ]
});

module.exports = logger;