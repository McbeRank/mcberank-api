const winston = require('winston');
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf } = format;
const config = require(__basedir + '/libs/config');
require('winston-daily-rotate-file');

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
})

const logger = createLogger({
    level: 'info',
    format: combine(
        label({ label: config.get('server.name') }),
        timestamp(),
        logFormat
    ),
    transports: [
        new transports.Console(),
        new transports.DailyRotateFile({
            filename: __basedir + '/logs/mcberank_%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d'
        })
    ]
});

/**
 * Middleware for logging express request & response
 */
logger.expressLogger = function(req, res, next){
    res.on('finish', function(){
        logger.info(`${req.ip} "${req.method} ${req.path} ${req.protocol}" ${res.statusCode}`);
    });
    next();
}

module.exports = logger;