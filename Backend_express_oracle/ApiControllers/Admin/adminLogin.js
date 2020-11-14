const executeQuery = require('../../Database/queryIntoDB')
const hashing = require('../../Database/hashing')

module.exports = function(app){
    app.post('/admin/login', (req, res)=>{
        console.log(req.body)

        AdminExistsQuery = 
        `
        SELECT ADMIN_NID, PASSWORD
        FROM ADMIN
        WHERE ADMIN_NID = :NID
        `

        AdminInfo = {
            NID : req.body.NID,
        }

        executeQuery(AdminExistsQuery, AdminInfo)
        .then((record)=>{
            console.log(record)
            if(record.rows.length != 0){
                var hashedPassword = record.rows[0].PASSWORD
                AdminInfo.password = req.body.password

                hashing.compareHash(AdminInfo.password, hashedPassword)
                .then((isMatched)=>{
                    if (isMatched){

                        res.json({serverMsg: 'Admin Logged In Successfully!', 
                        adminAccount: AdminInfo})
                    }
                    else{
                        console.log('Password is wrong')
                        res.json({serverMsg: 'NID or Password is wrong'})
                    }
                })

            }
            else{
                console.log('Admin login failed')
                res.json({serverMsg: 'NID or Password is wrong'})
            }
        })
    })
}