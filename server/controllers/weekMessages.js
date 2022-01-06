require('dotenv').config()
const express = require('express')
var router = express.Router()
var ObjectID = require('mongoose').Types.ObjectId
const tabletop = require('tabletop')

router.get('/', (req, res) => {
    tabletop.init({
        //key: '1IJQv1o72VFXUxFm_0GK4shLeUdfhVqoVtpkoUX4HPRM',
        key: process.env.GSHEETS_MESSAGES_BY_WEEK, //ENVIRONMENTS_VARIABLES
        simpleSheet: true
    })
        /* .then((data) => setData(data)) */
        /* .catch((err) => console.warn(err)); */
        .then((response, err) => {
            if (!err) {
                res.send(response)
                /* console.log(req) */
            }
            else { console.log('Error buscando la información: ' + JSON.stringify(err, undefined, 2)) }
        })
        .catch((err) => console.log(err));
})

module.exports = router