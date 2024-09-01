const httpStatus = require("http-status");
const { User, Token, Event} = require("../models");
const ApiError = require("../utils/ApiError");
const csv = require("csv-parser");
const fs = require("fs");
const { createEvent, getEvents, updateEvent, removeEvent } = require("./google.service");


const getUser = async ({token}) =>{

    const tokenDoc = await Token.findOne({token})
    const user = await User.findById(tokenDoc.user)

    return user;
}
const userDetails = async ({userId}) =>{
    const user = await User.findById(userId)

    return user;
}

const editUser = async (reqFile) =>{

    const body = reqFile.body;
    let user = await User.findById(body.userId)
    let uploadString = body.profilePicIsDeleted? "" : user.profilePic
    if(reqFile.file){
        uploadString = reqFile.file.filename
    }
    user.profilePic = uploadString
    user.bio = body.bio && body.bio !== "" ? body.bio : user.bio
    await user.save()

    return user;
}

const addEvent = async (reqBody) =>{
    const userId = reqBody.userId;
    delete reqBody.userId
    const token = await Token.findOne({user: userId})
    const googleEvent = await createEvent(token.token , reqBody)

    const myEvent = await Event.create({...reqBody, userId , google_event_id:googleEvent.data.id})



   return myEvent
    

}

const getAllEvents = async (reqBody) =>{

    
    const events = []
    const userId = reqBody.userId;
    const token = await Token.findOne({user: userId})
    //  console.log(token.token)
    const googleEvent = await getEvents(token.token , reqBody.startDate , reqBody.endDate)

    googleEvent.data.items.forEach((item) =>{
        events.push({
            id: item.id,
            title: item.summary,
            description: item.description,
            start: item.start.dateTime.split("+")[0],
            end: item.end.dateTime.split("+")[0],
            attendees: item.attendees
        })
    })

   return events
}

const editEvent = async (reqBody) =>{

    for(let [key , value] of Object.entries(reqBody)){
            if(value.length === 0){
                delete reqBody[key]
            }
    }

    const userId = reqBody.userId;
    delete reqBody.userId
    const token = await Token.findOne({user: userId})
    const googleId= reqBody.google_event_id
    delete reqBody.google_event_id
    let event = await Event.findOne({google_event_id:googleId})
    // if(!reqBody.start.dateTime)
    const googleEvent = await updateEvent(token.token , googleId, reqBody )
    // console.log(googleEvent)
    if(event){
        await Event.findByIdAndUpdate(event._id, reqBody , {new : true})
    }else{
        await Event.create({...reqBody, userId , google_event_id:googleId})
    }
    
    return googleEvent

}

const deleteEvent = async (reqBody) =>{
    const userId = reqBody.userId;
    const token = await Token.findOne({user: userId})
    const googleId= reqBody.google_event_id
    await Event.findOneAndUpdate({google_event_id: googleId},{isDeleted: true})
    await removeEvent(token.token, googleId)
    return true
}



module.exports = {
    getUser,
    userDetails,
    editUser,
    addEvent,
    getAllEvents,
    editEvent,
    deleteEvent
}