const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const config = require('./configuration/config');
const port = config.serverPort || 8080;
const router = require("./routes");
const multer = require('multer');
const path = require('path');


// const run = async () =>{

//     await sendEmail("abcccccd@yopmail.com" , "fewf","dsfdwf")
// }
// const mailchimpClient = require("@mailchimp/mailchimp_transactional")(
//     "md-cibYod7U9Avr747IAMd5Cw"
//   );
  
//   const run = async () => {
//     const response = await mailchimpClient.messages.send({ message: {
//         to: [{email: "abcccccd@yopmail.com" , name:"abc"}],
//         from_email: 'shirshendupal9@gmail.com',
//         subject: "subject",
//         text: "message"
//     } });
//     console.log(response);
//   };
  
//   run();
  

const runServer = () => { 

    mongoose.connect(config.mongoose.url, config.mongoose.options);

    app.use(cors());
    
    app.use(express.json());

    app.use("/api", router);
    app.use(express.static(path.join(__dirname, '../')));

    app.get('/api/videos/:videoName', (req, res) => {
        const videoPath = path.join(__dirname,"../uploads/videos/", req.params.videoName);
        res.sendFile(videoPath);
    });

    app.get("/api/profile-pic/:picName", (req, res) => {
        const profilePic =  path.join(__dirname,"../uploads/", req.params.picName);
        res.sendFile(profilePic);
    })
    

    
    app.listen(port, () => {
        console.log(`server listening over http on port ${port}`);
    });

    app.use((err, req, res, next) => {
        const { statusCode = 400, message = 'Something went wrong!' } = err;
        res.status(statusCode).json({ message, success: false });
    });

}

module.exports = { runServer };