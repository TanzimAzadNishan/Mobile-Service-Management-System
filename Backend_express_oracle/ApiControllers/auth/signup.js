const executeQuery = require('../../Database/oracleSetup')
//import {executeQuery} from '../../Database/oracleSetup'

module.exports = function(app){
    app.post('/signup', (req, res)=>{
        console.log(req.body)
        sqlQuery = `INSERT INTO Student VALUES (:Std_Id, :Std_Name, :Address)`
        bindingVars = {
            Std_Id : req.body.Std_Id,
            Std_Name: req.body.Std_Name,
            Address: req.body.Address
        }

        executeQuery(sqlQuery, bindingVars)
        .then((data)=>{
            console.log(data)
            res.json(data)
        })
    })
}