const mongoose = require('mongoose');

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

mongoose.waitForConnection = new Promise((resolve, reject) => {
	mongoose.connection.on('error', error => {
		logger.error('MongoDB: Error occured while connect to mongodb');
		logger.error(error);

		reject(error);
	});

	mongoose.connection.once('open', () => {
		logger.info(`MongoDB: Successfully connected to ${mongodb_url}/${database}`.replace('${password}', '******'));

		resolve();
	});
});

module.exports = mongoose;