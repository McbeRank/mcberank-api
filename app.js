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
const api = require(__basedir + '/routes/api');
const home = require(__basedir + '/routes/home');

app.use('/', express.static(__basedir + '/public'));
app.use('/', home);
app.use('/api', api);

/**
 * Start services
 */
QueryService.start();

app.listen(80, function(){
	console.log("[McbeRank] Server is now running on port 80");
});
