const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const dotenv = require('dotenv');

const path = require('path');
const bcrypt = require("bcryptjs");
dotenv.config({ path: path.join(__dirname, '../.env') });


const userSchema = new mongoose.Schema({
    email:String,
    full_name:String,
    isDeleted:{
        type: Boolean,
        default:false
    }
})

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10)
        console.log(this.password);
    }
    next()
})





userSchema.plugin(aggregatePaginate);
module.exports = mongoose.model("User", userSchema);