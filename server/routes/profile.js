var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { authorizedRoute, checkUserBanned } = require('../middlewares/auth.middleware');
const { getUserById, updateProfile, changePassword,  } = require('../models/user.model');
const { updateProfileRequestSchema, changePasswordRequestSchema } = require('../schema/profile.schema');
const { comparePassword, hashPassword } = require('../utils/auth.utils');
var router = express.Router();


router.get('/',authorizedRoute, checkUserBanned ,async (req,res) => {
    try {
        const identity = req.identity;

        console.log(identity);

        const userProfile = await getUserById(identity);

        console.log(userProfile);

        res.status(200).json({
            id: identity,
            username: userProfile.username,
            email: userProfile.email,
            fullName: userProfile.fullName,
            avatar: userProfile.avatar
        });
    }
    catch (err)
    {
        return handleExceptionInResponse(res,err);
    }
});

router.put('/',authorizedRoute, checkUserBanned, async (req,res) => {
    try {
        const identity = req.identity;
        const updateProfileRequest = req.body;

        const validatedUpdateProfileRequest = await updateProfileRequestSchema.validateAsync(updateProfileRequest);

        const email = validatedUpdateProfileRequest.email;
        const fullName = validatedUpdateProfileRequest.fullName;
        const avatar = validatedUpdateProfileRequest.avatar;

        await updateProfile(identity,fullName,email,avatar);

        return res.sendStatus(200);
    }
    catch (err)
    {
        return handleExceptionInResponse(res,err);
    }
});

router.put('/password', authorizedRoute, checkUserBanned, async (req,res) => {
    try {
        const identity = req.identity;
        const changePasswordRequest = req.body;

        const validatedChangePasswordRequest = await changePasswordRequestSchema.validateAsync(changePasswordRequest);

        const password = validatedChangePasswordRequest.password;
        const newPassword = validatedChangePasswordRequest.newPassword;

        const user = await getUserById(identity);

        const currentValidHashedPassword = user.hashedPassword;

        const isPasswordValid = await comparePassword(password,currentValidHashedPassword);

        if(!isPasswordValid)
            return res.status(400).json("Wrong password");
        
        const newHashedPassword = await hashPassword(newPassword);
        
        await changePassword(identity,newHashedPassword);

        return res.sendStatus(200);
    }
    catch (err) 
    {
        return handleExceptionInResponse(res,err);
    }
});

module.exports = router;