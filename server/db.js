const mongoose = require('mongoose')

mongoose.connect('mongodb://mongodb:27017/CRUD-Employees',{useNewUrlParser:true,useUnifiedTopology:true},
    err => {
        if (!err){
            console.log('Mongodb connection succeeded.')
        }
        else{
            console.log('Error while connecting MongoDB : ' + JSON.stringify(err, undefined, 2))
        }
    })