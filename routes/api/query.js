const asyncify = require('express-asyncify');
const router = asyncify(require('express').Router());
const controller = require(__basedir + '/controllers/controller.query');

/**
 * GET /?host=String&port=Number
 *
 * Get server status
 */
router.get('/', controller.queryServer);

module.exports = router;
