const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const moment = require('moment');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;
const iniparser = require('iniparser');
const config = iniparser.parseSync('config/config.ini');

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})

const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: config.server.name }),
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
            filename: 'mcberank-%DATE%.log',
            datePattern: 'YYYY-MM-DD-HH',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

/**
 * Middleware for logging express request & response
 */
logger.express = function(req, res, next){
    res.on('finish', function(){
        logger.info(`${req.ip} "${req.mthod} ${req.path} ${req.protocol}" ${res.statusCode}`);
    });
    next();
}

module.exports = logger;