const mongoose = require('mongoose');

const username = config.get('mongodb.username');
const password = config.get('mongodb.password');
const host = config.get('mongodb.host');
const database = config.get('mongodb.database');

const mongodb = {};

mongoose.connect(`mongodb://${username ? username + ':' + password + '@' : ''}${host}`, {
	dbName: database,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongodb.waitForConnection = new Promise((resolve, reject) => {
	const displayUrl = `mongodb://${username ? username + '@' : ''}${host}/${database}`;
	logger.info(`MongoDB: wait for connection to ${displayUrl} ...`);

	mongoose.connection.on('error', error => {
		logger.error('MongoDB: Error occured while connect to mongodb');
		logger.error(error);

		reject(error);
	});

	mongoose.connection.once('open', () => {
		logger.info(`MongoDB: Successfully connected to ${displayUrl}`);

		resolve();
	});
});

mongodb.mongoose = mongoose;

module.exports = mongodb;
