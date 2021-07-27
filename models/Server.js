const mongoose = require('mongoose');
const slug = require('slug');
const Gamedig = require('gamedig');
const dns = require('dns').promises;
const uniqueValidator = require('mongoose-unique-validator');
const { influx } = require(__basedir + '/libs/database/influxdb');
const moment = require('moment');
const Plugin = require('./Plugin');
const { isPort, isURL, isIP } = require('validator');
const { UnprocessableEntity } = require('http-errors');

const Schema = new mongoose.Schema({
    slug: {type: String, lowercase: true, unique: true},
    name: String,
    host: {
        type: String,
        required: [true, '서버 주소는 공란으로 둘 수 없습니다.'],
        validate: {
            validator: v => isURL(v, { require_valid_protocol: false }),
            message: props => `"${props.value}"는 잘못된 URL입니다.`
        }
    },
    port: {
        type: Number,
        validate: {
            validator: v => v && isPort(String(v)),
            message: props => `"${props.value}"는 잘못된 포트 번호입니다. 포트는 0-65535 사이의 값이어야 합니다.`
        },
        default: 19132
    },
    ip: {
        type: String,
        validate: {
            validator: v => isIP(v),
            message: props => `해당 주소의 IP 주소를 확인할 수 없습니다.`
        },
        default: ""
    },
    hosts_available: [{ type: String }],
    online: {type: Boolean, default: false},
    last_online: Date,
    title: String,
    version: String,
    engine: String,
    maxplayers: Number,
    numplayers: {type: Number, default: 0},
    rank: Number,
    players: [{ type: String }],
    plugins: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plugin' }]
}, { timestamps: true });

Schema.plugin(uniqueValidator, { message: '이미 등록되어 있는 서버입니다.' });

Schema.methods.slugify = function(){
    this.slug = encodeURIComponent(this.host) + ':' + this.port;
}

Schema.pre('validate', async function(next){
    if(!this.slug) this.slugify();
    if(!this.name) this.name = this.host + ':' + this.port;
    // if(!this.ip) this.ip = this.host;
    if(!this.ip) try{
        await this.resolveHost();
    }catch(error){ }

    next();
});

Schema.methods.resolveHost = async function(){
    return this.ip = (await dns.lookup(this.host)).address;
}

Schema.methods.gamedigParams = function(type){
    return {
        type: type,
        host: this.host,
        port: this.port || 19132,
        maxAttempts: 3,
        socketTimeout: 2000
    };
}

Schema.methods.parsePlugins = async function(plugins){
    // plugins exists?
    this.plugins = [];
    var parsedPlugins = plugins.split(": ").length > 1
        ? plugins
            .split(": ")[1] // ["PocketMine-MP 1.7 dev", "Plugins...."]
            .split("; ") // ["Plugin", "Plugin" ...]
            // ["PluginName", "Version"]
        : [];

    await Promise.all(parsedPlugins.map(async description => {
        var [ name, version ] = description.split(' ');
        var plugin = await Plugin.findOne({ name, version }).exec();
        if(!plugin){
            plugin = new Plugin({ name, version });
            await plugin.save();
        }
        this.plugins.push(plugin);
    }));
}

Schema.methods.query1 = async function(){
    try{
        var result = await Gamedig.query(this.gamedigParams('minecraftpeping'));

        this.online = true;
        this.last_online = new Date();
        this.title = result.raw.hostname.replace(/§[0-9a-gk-or]/gi, "");
        this.version = result.raw.version;
        this.maxplayers = result.raw.maxplayers;
        this.numplayers = result.raw.numplayers;
        this.engine = this.engine || result.raw.server_engine;
    }catch(error){
        this.online = false;
        this.numplayers = 0;
    }finally{
        // write stats if host is valid
        if(this.version) this.writePoint();
    }
}

Schema.methods.query2 = async function(){
    try{
        var result = await Gamedig.query(this.gamedigParams('minecraftpe'));

        this.engine = result.raw.server_engine || this.engine;
        this.players = result.players.map(player => player.name);
        await this.parsePlugins(result.raw.plugins || '');
    }catch(error){

    }
}

Schema.methods.numplayersStats = async function(from, to, samplingInterval){
    const series = 'numplayers';
    from = moment.utc(from || 'INVALID DATE').startOf('minute');
    to = moment.utc(to).startOf('minute');

    if(!from.isValid()) throw new UnprocessableEntity(`from value must be valid utc format`);
    if(!to.isValid()) throw new UnprocessableEntity(`to value must be valid utc format`);

    samplingInterval = samplingInterval || '1m';
    var availableSamplingIntervals = [
        '1m', '5m', '10m', '15m', '30m',
        '1h', '3h', '6h', '12h',
        '1d', '2d', '3d', '7d'
    ];
    if(!availableSamplingIntervals.includes(samplingInterval)){
        throw new UnprocessableEntity(`time interval value must be one of (${availableSamplingIntervals.join(', ')}) but "${samplingInterval}" given`);
    }

    var query = `SELECT max("${series}") FROM "servers"
        WHERE "server"='${this.name}'
        AND "time" >= '${from.format()}'
        AND "time" < '${to.format()}'
        GROUP BY time(${samplingInterval}) fill(null)`
    
    logger.info(`Getting stats from InfuxDB (server=${this.name} time=${from.format()}~time${to.format()} samplingInterval=${samplingInterval})`);

    var result = await influx.query(query, { precision: 'm' });

    return {
        server: this.name,
        from: from.format(),
        to: to.format(),
        samplingInterval: samplingInterval,
        result: result.map(d => d.max)
    };
}

Schema.methods.writePoint = function(){
    // precision: minutes
    influx.writePoints([
        {
            measurement: 'servers',
            tags: { server: this.name },
            fields: {
                online: this.online,
                numplayers: this.online ? this.numplayers : null
            }
        }
    ], {
        precision: 'm'
    });
}

Schema.methods.heartbeat = async function(){
    await Promise.all([
        this.query1(),
        this.query2()
    ]);
}

Schema.methods.toJSON = function(){
    return {
        slug: this.slug,
        name: this.name,
        host: this.host,
        port: this.port,
        online: this.online,
        last_online: this.last_online,
        title: this.title,
        version: this.version,
        engine: this.engine,
        maxplayers: this.maxplayers,
        numplayers: this.numplayers,
        rank: this.rank,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt
    }
}

Schema.methods.toJSONWithPlayers = function(){
    var json = this.toJSON();
    json.players = this.players;
    return json;
}

module.exports = mongoose.model('Server', Schema);