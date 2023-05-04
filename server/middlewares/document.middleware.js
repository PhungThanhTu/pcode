const { handleExceptionInResponse } = require("../exception");
const joi = require('joi');
const { getDocumentByIdSql, getRoleDocumentSql } = require("../models/document.model");

module.exports.verifyExistingDocument = async (req, res, next) => {
    try {
        const documentId = req.params.documentId;
        const validatedDocumentId = joi.string().uuid().validate(documentId);
        if(validatedDocumentId.error)
        {
            return res.sendStatus(404);
        }

        const document = await getDocumentByIdSql(documentId);

        if(!document)
        {
            return res.sendStatus(404);
        }

        req.document = document;

        next();
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
}

module.exports.verifyRoleDocument = (...roles) => async (req, res, next) => {

    try {
        const documentId = req.params.documentId;
        const identity = req.identity;
        const allowedRole = roles;
        const requestRole = await getRoleDocumentSql(documentId, identity);
        if(requestRole.length === 0 || !allowedRole.some((role) => role === requestRole[0].Role))
        {
            return res.sendStatus(403);
        }

        req.role = requestRole[0].Role;

        next();
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
}