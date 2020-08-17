module.exports = Promise.all([
	require('./mongodb').waitForConnection,
	require('./influxdb').waitForConnection
]);