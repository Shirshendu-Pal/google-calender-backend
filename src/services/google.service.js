const { google } = require('googleapis');
const path = require('path');
const dotenv = require('dotenv');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });
const envVarsSchema = Joi.object().keys({ 
    GOOGLE_CLIENT_ID: Joi.string().required(),
    GOOGLE_CLIENT_SECRET: Joi.string().required(),
    GOOGLE_REDIRECT_URI: Joi.string().required(),

}).unknown()

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);


const CLIENT_ID = envVars.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = envVars.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = envVars.GOOGLE_REDIRECT_URI;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);


const generateToken = async (code) => {
    try {
        const { tokens } = await oAuth2Client.getToken(code);
        return tokens;
      } catch (error) {
        return null
      }
}

const createEvent = async (refresh_token, requestBody) =>{
    try {
        oAuth2Client.setCredentials({refresh_token });
        const calendar = google.calendar('v3');
        const data = calendar.events.insert({
            auth: oAuth2Client,
            calendarId: 'primary',
            requestBody
        })
        return data
    } catch (error) {
        return null
    }
}

const getEvents = async (refresh_token , startDate , endDate) =>{
    try{
    oAuth2Client.setCredentials({refresh_token });
    const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date(startDate)).toISOString(),
      timeMax: (new Date(endDate)).toISOString(),
      maxResults: 500,  
      maxResults: 500,
      singleEvents: true,
      orderBy: 'startTime',
    });
    return response
}catch(e) {
    return null
}
}

const updateEvent = async (refresh_token, eventId, requestBody) => {
    try {
        oAuth2Client.setCredentials({ refresh_token });
        const calendar = google.calendar('v3');
        const data = await calendar.events.update({
            auth: oAuth2Client,
            calendarId: 'primary',
            eventId: eventId,
            requestBody
        });
        return data;
    } catch (error) {
        // console.error('Error updating event:', error);
        return null;
    }
}

const removeEvent = async (refresh_token, eventId) => {

    try {
        
        oAuth2Client.setCredentials({ refresh_token });
    
        // Create a calendar API instance
        const calendar = google.calendar('v3');
    
        // Call the events.delete method
        const data = await calendar.events.delete({
            auth: oAuth2Client,
            calendarId: 'primary',
            eventId: eventId
        });
    
        return true
    } catch (error) {
        return null
    }

}


module.exports = {
    generateToken,
    createEvent,
    getEvents,
    updateEvent,
    removeEvent
}

