const { handleExceptionInResponse } = require("../exception");
const joi = require('joi');
const { getDocumentByIdSql } = require("../models/document.model");

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