module.exports = Promise.all([
	require('./mongodb'),
	require('./influxdb')
]);