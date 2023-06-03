const { toCamel } = require("../utils/string.utils");

exports.camelizeResponse = async (req,res,next) => {
    var send = res.send;
    res.send = function (body) {
        const camlelizedBody = JSON.stringify(toCamel(JSON.parse(body)));
        send.call(this, camlelizedBody);
    };
    next();
}