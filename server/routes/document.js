const { randomUUID } = require('crypto');
var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { authorizedRoute } = require('../middlewares/auth.middleware');
const { getCourseByIdSql, getRoleInCourseSql } = require('../models/course.model');
const { createDocumentSql, linkDocumentWithCourseSql, getDocumentContentTypes, deleteDocumentSql, updateDocumentSql, setDocumentPublicityAllCourseSql } = require('../models/document.model');
const { documentCreationSchema, documentUpdateSchema } = require('../schema/document.schema');
const { uploadSingleFile } = require('../middlewares/media.middleware');
const { verifyExistingDocument, verifyRoleDocument } = require('../middlewares/document.middleware');
const { getFileExtensions } = require('../utils/media.utils');
const { lookup } = require('mime-types');
const { uploadMedia, deleteMedia } = require('../models/media.model');
const { createContentSql, getContentsByDocumentIdSql, deleteContentSql } = require('../models/content.model');
var router = express.Router();

const deleteAllDocumentContents = async (documentId) => {

    const documentContents = await getContentsByDocumentIdSql(documentId);

    for ( const documentContent of documentContents){
        if(documentContent.contentTypeId !== 0)
        {
            await deleteMedia(documentContent.ContentBody);
        }
        await deleteContentSql(documentContent.Id);
    }
}

router.post('/', authorizedRoute , async (req, res) => {
    try 
    {
        const identity = req.identity;
        const documentCreateRequest = req.body;
        const validatedDocumentCreateRequest = await documentCreationSchema.validateAsync(documentCreateRequest);

        const courseId = validatedDocumentCreateRequest.courseId;
        
        const course = await getCourseByIdSql(courseId);

        const role = await getRoleInCourseSql(courseId, identity);

        if(role.Role !== 0 )
        {
            return res.status(403).send("Not allowed");
        }

        if(!course){
            return res.status(404).send("Course not found");
        }

        const newDocumentId = randomUUID();

        const newDocument = {
            Id: newDocumentId,
            CourseId: courseId,
            Title: validatedDocumentCreateRequest.title,
            Description: validatedDocumentCreateRequest.description,
            HasExercise: validatedDocumentCreateRequest.hasExercise
        }

        await createDocumentSql(newDocumentId, newDocument.Title, newDocument.Description, identity, newDocument.HasExercise);

        await linkDocumentWithCourseSql(newDocumentId, newDocument.CourseId);

        return res.status(201).json(newDocument);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err)
    }
});

router.patch(
    '/:documentId', 
    authorizedRoute,
    verifyExistingDocument,
    verifyRoleDocument(0),
    async (req, res) => {
        try {         
            const documentId = req.params.documentId;
            const documentUpdateRequest = req.body;

            await documentUpdateSchema.validateAsync(documentUpdateRequest);

            const title = documentUpdateRequest.title;
            const description = documentUpdateRequest.description;

            await updateDocumentSql(documentId, title, description);

            return res.sendStatus(200);
        }
        catch (err)
        {
            return handleExceptionInResponse(res, err);
        }
    });

router.post(
    '/:documentId/publish',
    authorizedRoute,
    verifyExistingDocument,
    verifyRoleDocument(0),
    async (req, res) => {
        try {
            const documentId = req.params.documentId;
            const publicity = req.query.publish === '1' ? 1 : 0;

            console.log(publicity);
            await setDocumentPublicityAllCourseSql(documentId, publicity);
            
            return res.sendStatus(200);
        }
        catch (err)
        {
            return handleExceptionInResponse(res, err);
        }
    }
)

router.get(
    '/:documentId',
    authorizedRoute,
    verifyExistingDocument,
    async (req, res) => {
        try {
            const document = req.document;
            console.log(document.Id);
            const contents = await getContentsByDocumentIdSql(document.Id);

            return res.status(200).json({
                ...document,
                Contents: contents
            });
        }
        catch (err)
        {
            handleExceptionInResponse(res, err);
        }
    });

router.post(
    '/:documentId/content',
    authorizedRoute,
    verifyExistingDocument,
    verifyRoleDocument(1),
    uploadSingleFile, 
    async (req,res) => 
    {
        try {
            const documentId = req.params.documentId;
            const contentId = randomUUID();
            const contentTypeId = Number(req.body.contentTypeId);
            let content = ''

            if(contentTypeId === 0)
            {
                content = req.body.content | '';
            }
            else
            {
                const documentContentTypes = await getDocumentContentTypes();

                const isDocumentValid = documentContentTypes.some(e => e['Id'] === contentTypeId);

                if(!isDocumentValid)
                {
                    return res.status(400).send("This content type id is not supported");
                }

                const blobId = randomUUID();

                const file = req.file;
                const fileName = file.originalname;
                const fileContent = file.buffer;

                if(fileName.length >= 50){
                    return res.status(400).send("file name is limited at 50 chars");
                }

                const extension = getFileExtensions(fileName);
                const mime = lookup(extension);

                if(contentTypeId === 1 && extension !== 'pdf')
                {
                    return res.status(400).send("only pdf is supported in this content type");
                }

                // if content type is false, download is required
                let download = contentTypeId === 2 ? true : false;

                if(!mime)
                {
                    mime = 'application/octet-stream'
                }

                await uploadMedia(blobId, fileName, extension, mime, download, fileContent);
                content = blobId;
            }

            await createContentSql(contentId, contentTypeId, documentId, content);

            return res.status(201).json({
                contentId,
                contentTypeId,
                documentId,
                contentBody: content
            });
        }
        catch (err)
        {
            return handleExceptionInResponse(res, err);
        }
    });

router.delete(
    '/:documentId/content/',
    authorizedRoute,
    verifyExistingDocument,
    verifyRoleDocument(1),
    async (req,res) => {
        try {
            const documentId = req.document.Id;
            
            await deleteAllDocumentContents(documentId);

            return res.sendStatus(200);
        }
        catch (err)
        {
            return handleExceptionInResponse(res, err);
        }
    });

router.delete(
    '/:documentId',
    authorizedRoute,
    verifyExistingDocument,
    verifyRoleDocument(1),
    async (req, res) => {
        const documentId = req.document.Id;

        try {
            await deleteAllDocumentContents(documentId);
            await deleteDocumentSql(documentId);

            return res.sendStatus(200);
        }
        catch (err)
        {
            return handleExceptionInResponse(res, err);
        }

    }
)

module.exports = router;