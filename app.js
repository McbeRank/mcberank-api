/**
 * asyncify main() scope
 */
(async () => {
	/**
	 * Initialize global variables
	 */
	global.__basedir = __dirname;
	global.logger = require('./libs/logger');
	global.config = require('./libs/config');

	/**
	 * inject <base href=""> into index.html file
	 */
	const Injector = require('./libs/html-injector');
	const baseHref = config.get('subdomain.enable') == 'true' ? '/' + config.get('subdomain.subdomain') + '/' : '/';
	try {
		await Injector.injectBaseHref(__basedir + '/public/index.html', baseHref);
	} catch {}

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
	 * Setup database
	 */
	logger.info('Setup database ...');

	try {
		await require('./libs/database');
	} catch (error) {
		logger.error('Database connection failed');
		logger.error(error);

		process.exit(1);
	}

	/**
	 * Set up models
	 */
	require('./models');

	/**
	 * Set up routes
	 */
	app.use(require('./routes'));

	/**
	 * Set up error handler
	 */
	app.use(require(__basedir + '/libs/error-handler'));

	/**
	 * Start server
	 */
	logger.info('Starting server ...');
	const bind = config.get('server.bind');
	const port = config.get('server.port');
	const server = app.listen(port, bind, () => logger.info(`McbeRank server is now running on port ${bind}:${port}`));

	/**
	 * Handle shutdown signal (Ctrl+C / docker stop)
	 */
	require(__basedir + '/libs/shutdown-handler').handle(server);

	/**
	 * Start collection servers data
	 */
	require('./libs/server-collector').start();
})();
