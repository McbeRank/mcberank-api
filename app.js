/**
 * Initialize global variables
 */
global.__basedir = __dirname;

/**
 * Imports
 */
const fs = require('fs');
const csvWriter = require('csv-write-stream');
const schedule = require('node-schedule');
const Gamedig = require('gamedig');
const QueryService = require(__basedir + '/lib/query-service');
const express = require('express');
const bodyParser = require('body-parser');
const iniparser = require('iniparser');
const logger = require(__basedir + '/config/logger.js');

/**
 * Parse config.ini
 */
const config = iniparser.parseSync(__basedir + '/config/config.ini');
logger.info("config.ini = " + JSON.stringify(config, null, 2));

/**
 * Initialize express app
 */
var app = express();
app.set("view engine", "ejs");
app.set('json spaces', 2);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));

/**
 * winston: Logging request
 */
app.use(logger.express);

/**
 * Set up routes
 */
const root = express.Router();
const api = require(__basedir + '/routes/api');
const home = require(__basedir + '/routes/home');

if((config.subdomain.enable || "false").toLowerCase() == "true"){
	logger.info(`Subdomain is enabled = ${config.subdomain.subdomain}`)
	app.get('/', (req, res) => res.redirect(`/${config.subdomain.subdomain}`));
	app.use(`/${config.subdomain.subdomain}`, root);
}else{
	app.use('/', root);
}
root.use('/', express.static(__basedir + '/public'));
root.use('/', home);
root.use('/api', api);

/**
 * Start services
 */
QueryService.start();

const server = app.listen(
	config.server.port || 3500,
	config.server.bind || "0.0.0.0",
	function(){
		logger.info(`Server is now running on port ${config.server.bind}:${config.server.port}`);
	});

/**
 * Handle shutdown signal (Ctrl+C / docker stop)
 */
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown(){
	logger.info('Received kill signal, shutting down gracefully');
	server.close(() => {
		logger.info('Close server complete');
		process.exit(0);
	});

	/**
	 * 'Docker stop' wait for 10 seconds
	 * so we have to shutdown server in 8s (2s margin) if possible
	 */
	setTimeout(() => {
		logger.error('Could not close server in 8s, shutting down forcefully');
		process.exit(1);
	}, 8000);
}