require('dotenv').config() 
const express = require('express')
var router = express.Router()
var ObjectID = require('mongoose').Types.ObjectId
const { createClient } = require('@typeform/api-client')


//TeamPulse_Token
//const typeformAPI = createClient({ token: 'EXLG9eJNf8e7d5z1svhWw6c2PTPwJsDehhrpqwUDaSpH' })
const typeformAPI = createClient({ token: process.env.TYPEFORM_TOKEN }) //ENVIRONMENTS_VARIABLES

router.get('/', (req, res) => {
        typeformAPI
            .forms
            .list()
            .then((response, err) => {
                if (!err){
                    res.send(response)
                    /* console.log(req) */
                }
                else {console.log('Error buscando los formularios : ' + JSON.stringify(err, undefined, 2))}
            })
            
    
})

router.get('/id:id', (req, res) => {
    typeformAPI
        .forms
        .get({uid: req.params.id})
        .then((response, err) => {
            if (response){
                res.send(response)
            }
            else {console.log('Error buscando los formularios : ' + JSON.stringify(err, undefined, 2))}
        })
        .catch((err) => {
            if (err){
                res.send(err)
                console.log(err) 
            }
            else {console.log('Error buscando los formularios : ' + JSON.stringify(err, undefined, 2))}
        })

})

router.get('/workspace_id:id', (req, res) => {
    typeformAPI
        .forms.workspace
        .get({id: req.params.id})
        .then((response, err) => {
            if (response){
                res.send(response)
            }
            else {console.log('Error buscando los formularios : ' + JSON.stringify(err, undefined, 2))}
        })
        .catch((err) => {
            if (err){
                res.send(err)
                console.log(err) 
            }
            else {console.log('Error buscando los formularios : ' + JSON.stringify(err, undefined, 2))}
        })

})





module.exports = router