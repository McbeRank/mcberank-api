const iniparser = require('iniparser');
const ini = iniparser.parseSync('config/config.ini');

function getFromEnvironment(key) {
    return process.env['MCBERANK_' + key.replace(/[\.\s]/g, '_').toUpperCase()];
}

function getFromIni(key) {
    const props = key.split('.');
    var obj = ini;
    while(props.length && (obj = obj[props.shift()]));
    return obj;
}

const config = {
    get(key) {
        return getFromEnvironment(key) || getFromIni(key);
    }
}

module.exports = config;