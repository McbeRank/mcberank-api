const { InfluxDB, FieldType } = require('influx');
const waitPort = require('wait-port');

const [ host, portStr ] = config.get('influxdb.host').split(':');
const port = Number(portStr);
const username = config.get('influxdb.username');
const password = config.get('influxdb.password');
const database = config.get('influxdb.database');

const influxdb = {};

// influx.waitForConnection = influx.ping(5000);
influxdb.waitForConnection = (async () => {
    const displayUrl = `${username}@${host}:${port}/${database}`;
    logger.info(`InfluxDB: wait for connection to ${displayUrl} ...`);

    try {
        await waitPort({ host, port, output: 'silent' });
    } catch (error) {
        logger.error(`InfluxDB: connection failed!`);
        logger.error(error);

        throw error;
    }

    const influx = influxdb.influx = new InfluxDB({
        host,
        port,
        username,
        password,
        database,
        schema: [
            {
                measurement: 'servers',
                fields: {
                    online: FieldType.BOOLEAN,
                    numplayers: FieldType.INTEGER
                },
                tags: [ 'server' ]
            }
        ]
    });

    const databases = await influx.getDatabaseNames();

    logger.info(`InfluxDB: Successfully connected to ${displayUrl}`);

    if(!databases.includes(database)){
        logger.info(`InfluxDB: database is not exists. create one: ${database}`);
        influx.createDatabase(database);
    }
})();

module.exports = influxdb;