const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
            level: "debug",
            handleExceptions: true,
            json: false,
            colorize: true,
        })
    ]
});

module.exports = logger;