const Influx = require('influx');

const [ host, port ] = config.get('influxdb.host').split(':');
const username = config.get('influxdb.username');
const password = config.get('influxdb.password');
const database = config.get('influxdb.database');

logger.info(`InfluxDB: connect to ${username}:******@${host}:${port}/${database}`);

const influx = new Influx.InfluxDB({
    host,
    port,
    username,
    password,
    database,
    schema: [
        {
            measurement: 'servers',
            fields: {
                online: Influx.FieldType.BOOLEAN,
                numplayers: Influx.FieldType.INTEGER
            },
            tags: [ 'server' ]
        }
    ]
});

(async () => {
    if(!(await influx.getDatabaseNames()).includes(database)){
        logger.info(`InfluxDB: database is not exists. create one: ${database}`);
        influx.createDatabase(database);
    }
})();

module.exports = influx.ping(5000);