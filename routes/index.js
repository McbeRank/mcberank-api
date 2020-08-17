const express = require('express');
const root = express.Router();
const routes = express.Router();

/**
 * Support subdomain
 */
if((config.get('subdomain.enable') || "false").toLowerCase() == "true"){
	logger.info(`Subdomain is enabled = ${config.get('subdomain.subdomain')}`)
	root.get('/', (req, res) => {
		res.redirect(`/${config.get('subdomain.subdomain')}`);
	});
	root.use(`/${config.get('subdomain.subdomain')}`, root);
}else{
	root.use('/', routes);
}
routes.use('/api/query', require('./api/query'));
routes.use('/api/servers', require('./api/servers'));
routes.use('/api/plugins', require('./api/plugins'));
routes.use('/api/stats', require('./api/stats'));

/**
 * Support history mode for Vue
 */
const history = require('connect-history-api-fallback');
root.use('/', express.static('public'));
root.use(history({
	disableDotRule: true
}));
root.use('/', express.static('public'));

module.exports = root;