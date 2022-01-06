const mongoose = require('mongoose')

var Team = mongoose.model('Team',
{
    name : {type:String},
    area : {type:String},
    description : {type:String},
    teamNumber : {type:String},

},'teams')

module.exports = { Team}