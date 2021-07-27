const asyncify = require('express-asyncify');
const router = asyncify(require('express').Router());
const controller = require(__basedir + '/controllers/controller.servers');

/**
 * param :server
 */
router.param('server', controller.paramServer);

/**
 * GET /
 *
 * Get all servers
 */
router.get('/', controller.getServers);

/**
 * POST /
 *
 * Create new server
 */
router.post('/', controller.createServer);

/**
 * GET /:server
 *
 * Get server descriptions
 */
router.get('/:server', controller.getServer);

/**
 * DELETE /:server
 *
 * Delete server
 */
router.delete('/:server', controller.deleteServer);

module.exports = router;
