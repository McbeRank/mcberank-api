const mongoose = require('mongoose');
const Plugin = mongoose.model('Plugin');

var controller = {};

controller.getPlugins = async (req, res) => {
	res.json(await Plugin.find({}).exec());
};

controller.getPlugin = async (req, res) => {
	return res.json(await Plugin.findOne({ slug: req.param.plugin }).exec());
};

controller.deletePlugin = async (req, res) => {
	await Plugin.deleteOne({ slug: req.param.plugin }).exec();
	res.sendStatus(204);
};

module.exports = controller;
