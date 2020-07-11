const asyncify = require('express-asyncify');
const router = asyncify(require('express').Router());
const controller = require(__basedir + '/controllers/controller.plugins');

/**
 * GET /
 * 
 * Get all plugins
 */
router.get('/', controller.getPlugins);

/**
 * GET /:plugin
 * 
 * Get plugin descriptions
 */
router.get('/:plugin', controller.getPlugin);

/**
 * DELETE /:plugin
 * 
 * Delete plugin
 */
router.delete('/:plugin', controller.deletePlugin);


module.exports = router;