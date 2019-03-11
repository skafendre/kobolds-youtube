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
            json: true,
            colorize: true,
            prettyPrint: true,
        })
    ]
});

module.exports = logger;