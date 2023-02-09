const { randomUUID } = require('crypto');
var express = require('express');
const { handleExceptionInResponse } = require('../exception');
const { authorizedRoute } = require('../middlewares/auth.middleware');
const { registerUser, getUserByUsername, getUserById, updateRefreshToken } = require('../models/auth.model');
const { registerRequestSchema, loginRequestSchema, refreshRequestSchema } = require('../schema/auth.schema');
const { hashPassword, comparePassword, generateToken, decodeToken } = require('../utils/auth.utils');
const randToken = require('rand-token');
const { addDays } = require('../utils/datetime.utils');
var router = express.Router();


const generateAndUpateToken = async (id) => {
        const refreshToken = randToken.generate(100);
        const now = new Date(Date.now());
        console.log(now);
        const refreshTokenLifeTime = process.env.REFRESH_TOKEN_LIFETIME;
        console.log(refreshTokenLifeTime);
        const expiryDate = new Date(addDays(now,refreshTokenLifeTime));
        console.log(expiryDate);

        await updateRefreshToken(id,refreshToken,expiryDate);
        return refreshToken;
}

router.post('/register', async (req,res) => {
    try {
        const registerRequest = req.body;
        const validatedRegisterRequest = await registerRequestSchema.validateAsync(registerRequest);

        const username = validatedRegisterRequest.username;
        const mayBeAvailableUser = await getUserByUsername(username);
        console.log("username not available");
        console.log(mayBeAvailableUser);
        if(mayBeAvailableUser && mayBeAvailableUser.length >= 1)
            return res.sendStatus(409);

        const password = validatedRegisterRequest.password;
        const id = randomUUID();
        const hashedPassword = await hashPassword(password);

        await registerUser(
            id,
            validatedRegisterRequest.username,
            hashedPassword,validatedRegisterRequest.fullName,
            validatedRegisterRequest.email
        );
        return res.sendStatus(201);

    }
    catch (err){
        return handleExceptionInResponse(res,err);
    }
});

router.post('/login', async (req,res) => {
    try {
        const loginRequest = req.body;
        const validatedLoginRequest = await loginRequestSchema.validateAsync(loginRequest);

        const username = validatedLoginRequest.username;
        const password = validatedLoginRequest.password;

        const user = await getUserByUsername(username);
        if(!user)
            return res.sendStatus(401);
        
        
        const validPassword = user.hashedPassword;

        const isPasswordValid = await comparePassword(password,validPassword);

        if(!isPasswordValid)
            return res.sendStatus(401);
        
        const payload = {
            id: user.id
        };

        const signature = process.env.JWT_SECRET;
        const tokenLife = process.env.JWT_LIFETIME;

        const token = await generateToken(payload,signature,tokenLife);

        const refreshToken = await generateAndUpateToken(user.id);

        return res.status(200).json({
            token,
            refreshToken
        })
        
    }
    catch (err)
    {
        return handleExceptionInResponse(res,err);
    }
});

router.get('/profile',authorizedRoute,async (req,res) => {
    try {
        const identity = req.identity;

        console.log(identity);

        const userProfile = await getUserById(identity);

        console.log(userProfile);

        res.status(200).json({
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

router.post('/refresh',async (req,res) => {
    try {
        const request = req.body;
        const validatedRefreshRequest = await refreshRequestSchema.validateAsync(request);
    
        const token = validatedRefreshRequest.token;
        const refreshToken = validatedRefreshRequest.refreshToken;

        const signature = process.env.JWT_SECRET;
        const tokenLife = process.env.JWT_LIFETIME;


        const decodedData = await decodeToken(token,signature);

        if(!decodedData)
            return res.sendStatus(401);
        
        const userId = decodedData.payload.id;

        const user = await getUserById(userId);

        const validRefreshToken = user.refreshToken;
        const expiryDate = new Date(user.expiryDate);
        const now = new Date();

        const isValid = validRefreshToken === refreshToken && now < expiryDate;

        if(!isValid)
            return res.sendStatus(401);

        const payload = {
            id: userId
        }

        const newToken = await generateToken(payload,signature,tokenLife);
        const newRefreshToken = await generateAndUpateToken(userId);

        const result = {
            token: newToken,
            refreshToken: newRefreshToken
        }
        return res.status(200).json(result);

    }
    catch (err) {
        return handleExceptionInResponse(res,err);
    }

})

module.exports = router;