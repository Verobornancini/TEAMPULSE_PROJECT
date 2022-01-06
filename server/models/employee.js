const mongoose = require('mongoose')

var Employee = mongoose.model('Employee',
{
    firstName : {type:String},
    lastName : {type:String},
    email : {type:String},
    area : {type:String},
    legajo : {type:String},
    equipo : {type:String},

},'employees')

module.exports = { Employee}