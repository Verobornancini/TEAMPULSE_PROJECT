require('dotenv').config()
const express = require('express')
var router = express.Router()
var ObjectID = require('mongoose').Types.ObjectId
const sgMail = require('@sendgrid/mail')
var employees = ''
var algo = ''
//sgMail.setApiKey('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')
sgMail.setApiKey(process.env.SENDGRID_API_KEY) //ENVIRONMENTS_VARIABLES


var { Employee } = require('../models/employee')


router.post('/', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) {
            employees = docs
        }
        else {
            console.log('Error while retrieving all records : ' + JSON.stringify(err, undefined, 2))
            employees = '';
        }
    })

    if (employees !== '') {


        var envios = employees.map(function (value) {
            const msg = {
                to: value.email,
                from: 'ivan@teampulse.ai',
                subject: 'Envío de formulario',
             // html: '<strong>¡Hola! Soy Ivan de TeamPulse, te envío este breve formulario para que lo contestes. Espero que tengas una buen jornada! <br/>  https://bitlogic.typeform.com/to/YIhWBseY?mail=' + value.email + '</strong>',
                html: '<strong>¡Hola! Soy Ivan de TeamPulse, te envío este breve formulario para que lo contestes. Espero que tengas una buen jornada! <br/>  ' + process.env.URL_ESTADO_BIENESTAR + '?mail=' + value.email + '</strong>',  //ENVIRONMENTS_VARIABLES
            }

            sgMail
                .send(msg)
                .then(() => {
                    console.log('Email sent post sednPolls' + value.email)
                })
                .catch((error) => {
                    // Log friendly error
                    console.error(error);
                    if (error.response) {
                        // Extract error msg
                        const { message, code, response } = error;
                        // Extract response msg
                        const { headers, body } = response;
                        console.log('-----------------')
                        console.error(body);
                    }
                })
            return '1';
        });

    }



})


module.exports = router