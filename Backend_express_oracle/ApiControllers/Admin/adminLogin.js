const executeQuery = require('../../Database/oracleSetup')

module.exports = function(app){
    app.post('/admin-login', (req, res)=>{
        console.log(req.body)

        personAlreadyExistsQuery = 
        `
        SELECT ADMIN_NID, PASSWORD
        FROM ADMIN
        WHERE ADMIN_NID = :NID
        AND PASSWORD = :password
        `

        AdminInfo = {
            NID : req.body.NID,
            password: req.body.password
        }

        executeQuery(personAlreadyExistsQuery, PersonInfo)
        .then((record)=>{
            console.log(record)
            if(record.rows.length != 0){
                res.json({serverMsg: 'Logged In Successfully!', 
                            adminAccount: AdminInfo})
            }
            else{
                console.log('login failed')
                res.json({serverMsg: 'NID or Password is wrong'})
            }
        })
    })
}