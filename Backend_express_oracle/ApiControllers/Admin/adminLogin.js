const executeQuery = require('../../Database/oracleSetup')

module.exports = function(app){
    app.post('/admin/login', (req, res)=>{
        console.log(req.body)

        AdminExistsQuery = 
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

        executeQuery(AdminExistsQuery, AdminInfo)
        .then((record)=>{
            console.log(record)
            if(record.rows.length != 0){
                res.json({serverMsg: 'Admin Logged In Successfully!', 
                            adminAccount: AdminInfo})
            }
            else{
                console.log('Admin login failed')
                res.json({serverMsg: 'NID or Password is wrong'})
            }
        })
    })
}