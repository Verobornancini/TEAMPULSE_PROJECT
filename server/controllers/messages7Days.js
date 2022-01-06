require('dotenv').config()
const express = require('express')
var router = express.Router()
var ObjectID = require('mongoose').Types.ObjectId
const tabletop = require('tabletop')
const data = '';

router.get('/', (req, res) => {
    tabletop.init({
        //key: '1xUN8TDD9-OIwZe8UeUyLPDBLelgjExn44-bEKGqt_vY',
        key: process.env.GSHEETS_MESSAGES_LAST_7_DAYS, //ENVIRONMENTS_VARIABLES
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
})

module.exports = router