const controller = {};

controller.getNumplayersStats = async function(req, res){
    var from = req.query.from;
    var to = req.query.to;
    var samplingInterval = req.query.samplingInterval;

    res.json(await req.server.numplayersStats(from, to, samplingInterval));
}

module.exports = controller;