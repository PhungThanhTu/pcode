const { toCamel } = require("../utils/string.utils");

exports.camelizeResponse = async (req,res,next) => {
    var send = res.send;
    res.send = function (body) {
        // only camelize array or object
        if(body === null || (typeof body !== "object" && !Array.isArray(body)))
        {
            send.call(this, body);
            return;
        }
        const camlelizedBody = JSON.stringify(toCamel(JSON.parse(body)));
        send.call(this, camlelizedBody);
        return;
    };
    next();
}