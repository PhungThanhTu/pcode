const { verifyToken } = require("../utils/auth.utils");


exports.authorizedRoute = async (req,res,next) => {

    const accessToken = req.headers.authorization;
    const secret = process.env.JWT_SECRET;

    if(!accessToken)
        return res.sendStatus(401);

    const tokenData = await verifyToken(accessToken,secret);

    if(!tokenData)
        return res.sendStatus(401);

    req.identity = tokenData.payload.id;

    return next();
}