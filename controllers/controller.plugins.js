const mongoose = require('mongoose');
const Plugin = mongoose.model('Plugin');

var controller = {};

controller.getPlugins = async function(req, res){
    res.json(await Plugin.find({}).exec());
}

controller.getPlugin = async function(req, res){
    return res.json(await Plugin.findOne({ slug: req.param.plugin }).exec());
}

controller.deletePlugin = async function(req, res){
    await Plugin.deleteOne({ slug: req.param.plugin }).exec();
    res.sendStatus(204);
}

module.exports = controller;