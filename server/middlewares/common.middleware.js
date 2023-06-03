const { handleExceptionInResponse } = require("../exception");
const { toCamel } = require("../utils/string.utils");


module.exports.camelizeBody = async (req, res, next) => {
    try {
        
        var send = res.send;
        res.send = function (body) { // It might be a little tricky here, because send supports a variety of arguments, and you have to make sure you support all of them!
            //console.log(JSON.stringify(body, null, 2));
            camelizedBody = toCamel(JSON.parse(body));
            //console.log(JSON.stringify(camelizedBody, null, 2));
            send.call(this, camelizedBody);
        };
        next();
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
}
