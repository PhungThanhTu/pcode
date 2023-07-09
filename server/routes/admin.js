var express = require('express');
const { setUserStatusSql, getAllUsersSql } = require('../models/admin.model');
const { handleExceptionInResponse } = require('../exception');
const { generateToken } = require('../utils/auth.utils');
const { adminAuthorizedRoute, authorizedRoute } = require('../middlewares/auth.middleware');
var router = express.Router();

router.use(authorizedRoute);
router.use(adminAuthorizedRoute);

router.get('/user', async (req, res) => {
    try {     
      const result = await getAllUsersSql();
      return res.json(result);
    }
    catch (err){
      return handleExceptionInResponse(res, err);
    }
});

router.patch('/user/:id/:status', async (req, res) => {
  try {
    const userId = req.params.id;
    const status = req.params.status;

    await setUserStatusSql(userId, status);
    return res.sendStatus(200);
  }
  catch (err){
    return handleExceptionInResponse(res, err);
  }
})

router.post('/resetPassword/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const payload = {
      id,
      passwordReset: 1
    };

    const signature = process.env.JWT_SECRET;
    const tokenLife = process.env.JWT_LIFETIME;

    const token = await generateToken(payload,signature,tokenLife);

    return res.json({
      token
    });
  }
  catch (err)
  {
    return handleExceptionInResponse(res, err);
  }
})

module.exports = router;