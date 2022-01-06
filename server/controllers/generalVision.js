require('dotenv').config()
const express = require('express')
var router = express.Router()
var ObjectID = require('mongoose').Types.ObjectId
const tabletop = require('tabletop')



router.get('/', (req, res) => {
    tabletop.init({
        key: process.env.GSHEETS_NOTE_GLOBAL_POLARITY,  //ENVIRONMENTS_VARIABLES
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

        .catch((err) => console.warn(err));
})


module.exports = router