const multer = require('multer');
const path = require('path');


module.exports.storage = multer.diskStorage({
    destination: 'uploads/', // Specify the directory where files will be stored
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Set the file name
    }
});

module.exports.storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Check the file type
        const filetypes = /mp4/; 
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            cb(null, 'uploads/videos/'); 
        } else {
            cb(null, 'uploads/'); 
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Set the file name
    }
});