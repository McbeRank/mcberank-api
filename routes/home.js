const express = require('express');
const router = express.Router();

router.get('/', function(req, res){
	res.redirect('servers');
});

router.get('/servers', function(req, res){
	res.render('servers');
});

router.get('/plugins', function(req, res){
	res.render('plugins');
});

router.get('/api', function(req, res){
	res.render('api');
});

router.get('/server', function(req, res){
	res.render('server');
});

module.exports = router;