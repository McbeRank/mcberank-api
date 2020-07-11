const mongoose = require('mongoose');
const config = require(__basedir + '/libs/config');

/**
 * Set up mongodb
 */
const username = config.get('mongodb.username');
const password = config.get('mongodb.password');
const host = config.get('mongodb.host');
const database = config.get('mongodb.database');

const mongodb_url = 'mongodb://'
	+ (username ? username + ':' + '${password}' + '@' : '')
	+ host;

mongoose.connect(mongodb_url.replace('${password}', password), {
	dbName: database,
	useNewUrlParser: true,
	useUnifiedTopology: true
});

mongoose.connection.on('error', error => {
	logger.error('MongoDB: Error occured while connect to mongodb');
	logger.error(error);
});
mongoose.connection.once('open', () => {
    logger.info(`MongoDB: Successfully connected to ${mongodb_url}/${database}`.replace('${password}', '******'));
});

module.exports = require('mongoose');