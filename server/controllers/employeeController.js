const express = require('express')
var router = express.Router()
var ObjectID = require('mongoose').Types.ObjectId


var { Employee } = require('../models/employee')


router.get('/', (req, res) => {
    Employee.find((err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while retrieving all records : ' + JSON.stringify(err, undefined, 2))
    })
})

router.post('/', (req, res) => {
    var newRecord = new Employee({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        area: req.body.area,
        legajo: req.body.legajo,
        equipo: req.body.equipo
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
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        area: req.body.area,
        legajo: req.body.legajo,
        equipo: req.body.equipo
    }
    // Paso por parametros id, seteo los cambios ($set),  
    Employee.findByIdAndUpdate(req.params.id, { $set: updatedRecord }, { new: true }, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2))
    })
})

router.delete('/:id', (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('No record with given id : ' + req.params.id)

    Employee.findByIdAndRemove(req.params.id, (err, docs) => {
        if (!err) res.send(docs)
        else console.log('Error while deleting a record : ' + JSON.stringify(err, undefined, 2))
    })
})


module.exports = router