const { User, Token } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const { generateAuthToken } = require("./token.service");
const bcrypt = require("bcryptjs");
const { generatePassword, getUser } = require("./reusable.service");
const { generateToken } = require("./google.service");
const { jwtDecode } = require('jwt-decode');
// const  generateAuthToken = require("./token.service");
// const { uploadSingle } = require("./upload.service");

const registerUser = async (reqFile) => {
  // console.log("called")
  try {

    console.log(reqFile.file , reqFile.body)
    let uploadString = "";
    const body = reqFile.body;
    const existingUser = await User.findOne({
      $or: [{ email: body.email }, { phone: body.phone }],
    });

    if (existingUser)
      throw new ApiError(httpStatus.UNAUTHORIZED, "user already registered");

    if (reqFile.file) uploadString = reqFile.file.filename;

    const sameNameUsers = await User.find({
      first_name: body.first_name,
      isDeleted: false,
    });
    const passwords = sameNameUsers.map((suser) => suser.password);
    body["password"] = await generatePassword(
      body.first_name,
      body.last_name,
      body.phone,
      passwords
    );

   

    const user = await User.create({
      ...body,
      profilePic: uploadString,
    });
    await sendEmail(user.email, "Registration Successfull", "your password is "+body.password)

    return user;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, error.message);
  }
};

const loginUser = async (reqBody) => {
  try {

    const tokens = await generateToken(reqBody.code)
    console.log(tokens);
    const decoded = jwtDecode(tokens.id_token);
    console.log(decoded);

    let user = await User.findOne({email: decoded.email})

    if(!user){
      user = await User.create({
       email: decoded.email,
       full_name: decoded.name
     })
    }

    let token = await Token.findOne({user: user._id , type: "refresh"})
    if(token){
      token.token = tokens.refresh_token
      token.expires = new Date(tokens.expiry_date)
      await token.save()
    }else{

      token = await Token.create({
       user: user._id,
       token: tokens.refresh_token,
       type:"refresh",
       expires: new Date(tokens.expiry_date)
     })
    }

    return {user , tokens}
   
  } catch (error) {
    throw new ApiError(httpStatus.NOT_FOUND, "user does not exist");
  }
};

const verify = async ({token}) =>{
  const tokenDoc = await Token.findOne({token}).populate("user")
  if(!tokenDoc || !tokenDoc.user) throw new ApiError(httpStatus.NOT_FOUND, "token not found")
  return tokenDoc.user

}

module.exports = {
  registerUser,
  loginUser,
  verify
};
