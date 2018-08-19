const express = require('express');
const fs = require('fs');
const McbeRank = require(__basedir + '/public/assets/js/McbeRank.js');

const router = express.Router();

router.get('/server', function(req, res){
	if(!('host' in req.query)) return res.json({ status: 400 }); // Bad request

	var host = req.query.host;
	var port = req.query.port || "19132";

	if(!host.match(McbeRank.regex.host)) return res.json({ status: 400 });
	if(!port.match(McbeRank.regex.port)) return res.json({ status: 400 });

	fs.readFile('./public/data/servers/' + host + '-' + port + '.json', function(err, data){
		if(err) return res.json({ status: 404 }); // Not found

		res.json({
			status: 200,
			data: JSON.parse(data)
		});
	});
});

router.get('/online-servers', function(req, res){
	fs.readFile('./public/data/online-servers.json', function(err, data){
		if(err) return res.json({ status: 404 });

		res.json({
			status: 200,
			data: JSON.parse(data)
		});
	});
});

router.get('/offline-servers', function(req, res){
	fs.readFile('./public/data/offline-servers.json', function(err, data){
		if(err) return res.json({ status: 404 });

		res.json({
			status: 200,
			data: JSON.parse(data)
		});
	});
});

router.get('/plugins', function(req, res){
	fs.readFile('./public/data/plugins.json', function(err, data){
		if(err) return res.json({ status: 404 });

		res.json({
			status: 200,
			data: JSON.parse(data)
		});
	});
});

router.get('/total', function(req, res){
	fs.readFile('./public/data/total.json', function(err, data){
		if(err) return res.json({ status: 404 });

		res.json({
			status: 200,
			data: JSON.parse(data)
		});
	});
});

module.exports = router;