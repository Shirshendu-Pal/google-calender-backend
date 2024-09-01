const mongoose = require("mongoose");
const tokenTypes = require("../configuration/tokens");

const tokenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    token: {
        type: String,
        required: true,
        index: true
    },
    expires: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD_LINK, tokenTypes.MAIL_VERIFY, tokenTypes.RESET_PASSWORD_OTP],
        required: true
    }
}, { timestamps: true });

// tokenSchema.methods.generateAuthToken = async function () {
//     try {
//         let token = jwt.sign({_id: this._id}, process.env.SECRET_KEY)
//         this.tokens = this.tokens.concat({token:token})
//         await this.save();
//         return token;
//     } catch (error) {
//        console.log(error); 
//     }
// }

module.exports = mongoose.model('Token', tokenSchema);