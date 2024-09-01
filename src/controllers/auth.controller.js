const httpStatus = require("http-status");
const { catchAsync } = require("../utils/catchAsync");
const { authService, tokenService } = require("../services");



const handleRequest = (serviceFunction, reqQuery , reqFile, reqParam) => {
    return catchAsync(async (req, res) => {
      const requestField = reqQuery?req.query:reqFile?{file:req.file,body:req.body}:reqParam?req.params:req.body
      const result = await serviceFunction(requestField);
      res.status(httpStatus.OK).json({success: true,result});
    });
  };

  module.exports.loginUser = handleRequest(authService.loginUser);
  module.exports.verify = handleRequest(authService.verify, true);
