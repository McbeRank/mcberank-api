const mongoose = require('mongoose');
const Server = mongoose.model('Server');
const Plugin = mongoose.model('Plugin');

const ServerCollector = {
    handlers: [],

    start() {
        if(this.handlers.length) return logger.error('ServerCollector is already running');

        this.setInterval(async () => {
            (await Server.find({}).exec()).forEach(async server => {
                await server.query2();
                await server.save();
            });
        
            (await Server.find({}).sort({ online: -1, numplayers: -1 }).exec()).forEach(async (server, i) => {
                server.rank = i + 1;
                await server.save();
            });
        
            (await Plugin.find({}).exec()).forEach(plugin => {
                plugin.countReferencedServer();
            });
        }, 30000);
        
        this.setInterval(async () => {
            (await Server.find({}).exec()).forEach(async server => {
                await server.query1();
                await server.save();
            });
        }, 3000);

        logger.info('ServerCollector is now running...');
    },

    setInterval(callback, interval) {
        this.handlers.push(setInterval(callback, interval));
    },

    stop() {
        this.handlers.forEach(clearInterval);
    }
}

module.exports = ServerCollector;