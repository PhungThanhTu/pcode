var express = require('express');
const { authorizedRoute } = require('../middlewares/auth.middleware');
const { verifyExistingDocument } = require('../middlewares/document.middleware');

var router = express.Router({ mergeParams: true });

router.use(verifyExistingDocument);

router.get('/', (req,res) => {
    console.log(req.params);
    res.send("well done");
});

module.exports = router;