const mongoose = require('mongoose');
const Server = mongoose.model('Server');
const { NotFound, UnprocessableEntity } = require('http-errors');
const controller = {};
const config = require('../libs/config');

controller.paramServer = async function(req, res, next, server){
    req.server = await Server.findOne({ slug: server })
        .populate('plugins')
        .exec();
    
    if(!req.server) return next(new NotFound(`요청한 서버 "${server}"를 찾을 수 없습니다.`));

    next();
}

controller.getServers = async function(req, res){
    res.json((await Server.find({}).sort('rank').exec()).map(server => server.toJSON()));
}

controller.getServer = async function(req, res){
    res.json(req.server.toJSONWithPlayers());
}

controller.getServerDescription = async function(req, res){
    res.json(req.server.toJSONWithPlayers()[req.params.description]);
}

controller.createServer = async function(req, res){
    var server = new Server({ host: req.body.host });
    if(req.body.port) server.port = req.body.port;

    await server.validate();

    await server.query1();
    if(!server.online) throw new UnprocessableEntity('서버가 오프라인입니다. 서버 상태를 확인해주세요.');

    // Check whether the server belongs to the registrant or not
    if(config.get('registration.verify-motd-before-registration') == 'true'){
        var validMotd = config.get('registration.verify-motd-name');

        if(server.title !== validMotd) throw new UnprocessableEntity(`서버를 추가하려면 MOTD를 ${validMotd}로 설정해주세요.`);
    }
    
    await server.save();

    logger.info('Create server');
    logger.info(`Host=${server.host}`);
    logger.info(`Port=${server.port}`);

    // successfully created
    res.status(201).json({
        message: '성공적으로 서버를 추가하였습니다.'
    });
}

controller.deleteServer = async function(req, res){
    await req.server.delete().exec();
    res.sendStatus(204);
}

module.exports = controller;
