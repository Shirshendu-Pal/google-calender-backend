const express = require("express");
const router = express.Router();
const validate = require("../middlewares/validate");
const { authValidation } = require("../validations");
const { authController } = require("../controllers");
const { authService } = require("../services");
const multer = require('multer');
const { storage } = require("../configuration/storage");
const upload = multer({ storage: storage });


router.post("/login", validate(authValidation.loginUser), authController.loginUser);

router.get("/verify",authController.verify )

module.exports = router;