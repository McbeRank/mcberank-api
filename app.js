/**
 * Initialize global variables
 */
global.__basedir = __dirname;

/**
 * Imports
 */
const fs = require('fs');
const csvWriter = require('csv-write-stream');
const schedule = require('node-schedule');
const Gamedig = require('gamedig');
const QueryService = require(__basedir + '/lib/query-service');
const express = require('express');
const bodyParser = require('body-parser');
const iniparser = require('iniparser');

/**
 * Parse config.ini
 */
const config = iniparser.parseSync(__basedir + '/config/config.ini');
console.log("config.ini = " + JSON.stringify(config, null, 2));

/**
 * Initialize express app
 */
var app = express();
app.set("view engine", "ejs");
app.set('json spaces', 2);
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended:true}));

/**
 * Set up routes
 */
const root = express.Router();
const api = require(__basedir + '/routes/api');
const home = require(__basedir + '/routes/home');

if((config.subdomain.enable || "false").toLowerCase() == "true"){
	console.log(`[McbeRank] Subdomain is enabled = ${config.subdomain.subdomain}`)
	app.get('/', (req, res) => res.redirect(`/${config.subdomain.subdomain}`));
	app.use(`/${config.subdomain.subdomain}`, root);
}else{
	app.use('/', root);
}
root.use('/', express.static(__basedir + '/public'));
root.use('/', home);
root.use('/api', api);

/**
 * Start services
 */
QueryService.start();

app.listen(
	config.server.port || 3500,
	config.server.bind || "0.0.0.0",
	function(){
		console.log(`[McbeRank] Server is now running on port ${config.server.bind}:${config.server.port}`);
	});
