const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");


const eventSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    summary: String,
    description: String, 
    start: Object, 
    end: Object, 
    attendees: Array,
    google_event_id: String,
    isDeleted: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Event", eventSchema);