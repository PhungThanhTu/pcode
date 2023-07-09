const { getAdminUserSql } = require("../models/admin.model");
const { getUserStatusSql } = require("../models/user.model");
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

exports.checkUserBanned = async (req, res, next) => {
    const identity = req.identity;
    const query = await getUserStatusSql(identity);
    const status = query.userStatus;
    if(status === -1)
    {
        return res.status(403).send(
            "User is banned from the system"
        )
    }
    next();
}

exports.adminAuthorizedRoute = async (req, res, next) => {
    const identity = req.identity;
    const query = await getAdminUserSql(identity)
    if(!query)
    {
        return res.sendStatus(403);
    }
    next();
}