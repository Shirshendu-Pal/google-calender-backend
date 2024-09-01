const { catchAsync } = require("../utils/catchAsync");
const { userService, tokenService } = require("../services");
const httpStatus = require("http-status");



const handleRequest = (serviceFunction, reqQuery , reqFile, reqParam) => {
  
    return catchAsync(async (req, res) => {
      // console.log("ghghug")
      const requestField = reqQuery?req.query:reqFile?{file:req.file,body:req.body}:reqParam?req.params:req.body
      const result = await serviceFunction(requestField);
      res.status(httpStatus.OK).json({success: true,result});
    });
  };

  module.exports.getUser = handleRequest(userService.getUser,true);
  module.exports.userDetails = handleRequest(userService.userDetails);
  module.exports.editUser = handleRequest(userService.editUser,false, true);
  module.exports.addEvent = handleRequest(userService.addEvent);
  module.exports.getAllEvents = handleRequest(userService.getAllEvents);
  module.exports.editEvent = handleRequest(userService.editEvent);
  module.exports.deleteEvent = handleRequest(userService.deleteEvent);