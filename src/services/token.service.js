

const jwt = require('jsonwebtoken');
const config = require('../configuration/config');
const tokenTypes = require('../configuration/tokens');
const { Token, User } = require('../models');
const moment = require('moment');
// const { getUser } = require("./user.service");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const generateToken = (user, expires, type, secret = config.jwt.secret) => {
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    };
    return jwt.sign(payload, secret);
};
const saveToken = async (userId, expires, type, token) => {

    await Token.deleteMany({ user: userId, type });

    const tokenDoc = await Token.create({
        user: userId,
        expires: expires.toDate(),
        type,
        token
    });

    return tokenDoc;
};

const generateAuthToken = async (user) => {
    const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = generateToken(user, accessTokenExpires, tokenTypes.ACCESS);

    const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
    const refreshToken = generateToken(user, refreshTokenExpires, tokenTypes.REFRESH);

    await saveToken(user._id, refreshTokenExpires, tokenTypes.REFRESH, refreshToken);

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate()
        }
    };
};

const verifyToken = async (token, type) => {
    const payload = jwt.verify(token, config.jwt.secret);
    const tokenDoc = await Token.findOne({ user: payload.sub, type, token });
    if (!tokenDoc)
        throw new Error('Token not found.');
    return tokenDoc;
};




module.exports = {

    generateAuthToken,
    generateToken,
    saveToken,
    verifyToken

};