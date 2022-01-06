require('dotenv').config()
const express = require('express')
var router = express.Router()
var ObjectID = require('mongoose').Types.ObjectId
const tabletop = require('tabletop')

router.get('/', (req, res) => {
    tabletop.init({
        //key: '1DmnUGT_B4J2TkvXhzaYAqnSWTuqbUV4sPnqF4pQuJRs',
        key: process.env.GSHEETS_TOP_5_EMOJIS, //ENVIRONMENTS_VARIABLES
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