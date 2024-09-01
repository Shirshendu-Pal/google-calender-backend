const { Token, User } = require("../models");
const httpStatus = require("http-status");
const tokenTypes = require("../configuration/tokens");
const jwt = require('jsonwebtoken');
const config = require('../configuration/config');

module.exports.authCheck = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization)
            token = req.headers.authorization;
        const tokenDoc = await Token.findOne({ token : token }).populate("user");
        req.user = tokenDoc.user;
        next();
    } catch (error) {
        res.status(httpStatus.UNAUTHORIZED).json({ success: false, message: "Invalid or expired token" });
    }
};