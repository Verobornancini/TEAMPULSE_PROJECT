const express = require('express')
var router = express.Router()
var ObjectID = require('mongoose').Types.ObjectId


var { Team } = require('../models/team')


router.get('/', (req, res) => {
    Team.find((err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while retrieving all records : ' + JSON.stringify(err, undefined, 2))
    })
})

router.post('/', (req, res) => {
    var newRecord = new Team({
        name: req.body.name,
        area: req.body.area,
        description: req.body.description,
        teamNumber: req.body.teamNumber
    })

    newRecord.save((err, docs) => {
        // Valido que el post se haya realizado
        if (!err) res.send(docs)
        else console.log('Error while creating new record : ' + JSON.stringify(err, undefined, 2))
    })
})

router.put('/:id', (req, res) => {

    // Valido ID
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('No record with given id : ' + req.params.id)

    var updatedRecord = {
        name: req.body.name,
        area: req.body.area,
        description: req.body.description,
        teamNumber: req.body.teamNumber
    }
    // Paso por parametros id, seteo los cambios ($set),  
    Team.findByIdAndUpdate(req.params.id, { $set: updatedRecord }, { new: true }, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2))
    })
})

router.delete('/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('No record with given id : ' + req.params.id)

    Team.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while deleting a record : ' + JSON.stringify(err, undefined, 2))
    })
})


module.exports = router