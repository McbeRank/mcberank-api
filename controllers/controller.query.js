const mongoose = require('mongoose');
const Server = mongoose.model('Server');

var controller = {};

controller.queryServer = async function(req, res, next){
    var query = { host: req.query.host, port: req.query.port };
    var server = await Server.findOne(query).exec();

    // cannot find our database
    if(!server){
        server = new Server(query);
        await server.validate();

        await Promise.all([
            server.query1(),
            server.query2()
        ]);
    }

    res.json(server.toJSONWithPlayers());
}

module.exports = controller;