/**
 * asyncify main() scope
 */
(async () => {

/**
 * Initialize global variables
 */
global.__basedir = __dirname;
const logger = require('./libs/logger');
global.logger = logger;

/**
 * Parse config.ini
 */
const config = require('./libs/config');

/**
 * inject <base href=""> into index.html file
 */
const Injector = require('./libs/html-injector');
const baseHref = config.get('subdomain.enable') == 'true'
					? '/' + config.get('subdomain.subdomain') + '/'
					: '/';
await Injector.injectBaseHref(__basedir + '/public/index.html', baseHref);

/**
 * Initialize express app
 */
const express = require('express');
const app = express();
app.set('json spaces', 4);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * winston: Logging request
 */
app.use(logger.expressLogger);

/**
 * Register models
 */
require('./models/Server');
require('./models/Plugin');

/**
 * Set up routes
 */
const root = express.Router();

if((config.get('subdomain.enable') || "false").toLowerCase() == "true"){
	logger.info(`Subdomain is enabled = ${config.get('subdomain.subdomain')}`)
	app.get('/', (req, res) => res.redirect(`/${config.get('subdomain.subdomain')}`));
	app.use(`/${config.get('subdomain.subdomain')}`, root);
}else{
	app.use('/', root);
}
root.use('/api/query', require('./routes/api/query'));
root.use('/api/servers', require('./routes/api/servers'));
root.use('/api/plugins', require('./routes/api/plugins'));
root.use('/api/stats', require('./routes/api/stats'));

/**
 * Set up routes: Support history mode for Vue
 */
const history = require('connect-history-api-fallback');
root.use('/', express.static('public'));
root.use(history({
	disableDotRule: true
}));
root.use('/', express.static('public'));

/**
 * Set up error handler
 */
app.use(require(__basedir + '/libs/error-handler'));

/**
 * Set up database
 */
require('./libs/mongodb');
require('./libs/influxdb');

/**
 * Start services
 */
const bind = config.get('server.bind');
const port = config.get('server.port');
const server = app.listen(
	port,
	bind,
	() => logger.info(`Express server is now running on port ${bind}:${port}`)
);

/**
 * Handle shutdown signal (Ctrl+C / docker stop)
 */
const ShutdownHandler = require(__basedir + '/libs/shutdown-handler');
ShutdownHandler.handle(server);

/**
 * Start collection servers data
 */
const ServerCollector = require('./libs/server-collector');
ServerCollector.start();

})();