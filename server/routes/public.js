var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { getContentTypesSql } = require('../models/content.model');
const { getAllJudgersSql } = require('../models/judger.model');

var router = express.Router();

router.get('/contentTypes', async (req, res) => {
    try {
        const contentTypes = await getContentTypesSql();

        return res.json(contentTypes);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

router.get('/judger', async (req, res) => {
    try {
        const contentTypes = await getAllJudgersSql();

        return res.json(contentTypes);
    }
    catch (err)
    {
        return handleExceptionInResponse(res, err);
    }
})

module.exports = router;