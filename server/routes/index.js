var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const notificationString = `The server is running properly
  last update: 9/5/2023 - 05:44AM
  `
  res.send(notificationString);
});

module.exports = router;
