require('./db')
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const logger = require('morgan')
/* const sgMail = require('@sendgrid/mail') */
const cors = require('cors')
const createError = require("http-errors")


/* sgMail.setApiKey(process.env.SENDGRID_API_KEY) */

var postMessageRoutes = require('./controllers/postMessageController')
var employeeRoutes = require('./controllers/employeeController')
var teamRoutes = require('./controllers/teamController')
var forms = require('./controllers/forms')
var teams = require('./controllers/teams')
var images = require('./controllers/images')
var themes = require('./controllers/themes')
var workspaces = require('./controllers/workspaces')
var responses = require('./controllers/responses')
var sendPolls = require('./controllers/sendPolls')
var weekMessages = require('./controllers/weekMessages')
var messages7Days = require('./controllers/messages7Days')
var topWords = require('./controllers/topWords')
var generalVision = require('./controllers/generalVision')
var channelMessages = require('./controllers/channelMessages')
var indiceBienestar = require('./controllers/indiceBienestar')
var top5Emojis = require('./controllers/top5Emojis')
var top5Reactions = require('./controllers/top5Reactions')
var topWordsNegative = require('./controllers/topWordsNegative')
var topWordsPositive = require('./controllers/topWordsPositive')




var app = express()
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.json())
app.use(cors())/*{ origin: 'http://client:80' } { origin: 'http://100.26.46.75:80' }*/
app.use(logger("dev"))
app.listen(8080, () => console.log('Server started at : 8080'))


exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            //"Access-Control-Allow-Origin": "http://52.91.51.69", //"http://100.26.46.75",
            "Access-Control-Allow-Origin": process.env.URL_CLIENT, //"http://100.26.46.75", //ENVIRONMENTS_VARIABLES
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
        },
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

/* const msg = { */
/*     to: 'leandro.dipalma@bitlogic.io', // Change to your recipient */
/*     from: 'ivan@teampulse.ai', // Change to your verified sender */
/*     subject: 'Envio de formulario de prueba', */
/*     text: '¡Hola! Soy Iván de TeamPulse, te invito a completar el siguiente formulario: ', */
/*     html: '<strong>https://bitlogic.typeform.com/to/BFsC6b4L</strong>', */
/* } */
/*  */
/* sgMail */
/*     .send(msg) */
/*     .then(() => { */
/*         console.log('Email sent') */
/*     }) */
/*     .catch((error) => { */
/*         console.log('error') */
/*         console.error(error) */
/*     }) */
/*  */

console.log(process.env.URL_ESTADO_BIENESTAR)

app.use('/postMessages', postMessageRoutes)
app.use('/employee', employeeRoutes)
app.use('/team', teamRoutes)
app.use('/forms', forms)
app.use('/teams', teams)
app.use('/images', images)
app.use('/themes', themes)
app.use('/workspaces', workspaces)
app.use('/responses', responses)
app.use('/sendPolls', sendPolls)
app.use('/weekMessages', weekMessages)
app.use('/messages7Days', messages7Days)
app.use('/topWords', topWords)
app.use('/generalVision', generalVision)
app.use('/channelMessages', channelMessages)
app.use('/indiceBienestar', indiceBienestar)
app.use('/top5Emojis', top5Emojis)
app.use('/top5Reactions', top5Reactions)
app.use('/topWordsNegative', topWordsNegative)
app.use('/topWordsPositive', topWordsPositive)

app.use('/login', (req, res) => {
    res.send({
        token: 'bitlogic1234'
    });
});

