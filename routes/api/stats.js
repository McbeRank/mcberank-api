const asyncify = require('express-asyncify');
const router = asyncify(require('express').Router());
const controller = require(__basedir + '/controllers/controller.stats');
const controller_servers = require(__basedir + '/controllers/controller.servers');

/**
 * param :server
 */
router.param('server', controller_servers.paramServer);

/**
 * GET /numplayers/:server?from=Date&to=Date&samplingInterval=10m
 * 
 * Get players stat
 */
router.get('/:server/numplayers', controller.getNumplayersStats);


module.exports = router;