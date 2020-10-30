const executeQuery = require('../../Database/oracleSetup')

module.exports = function(app){
    app.post('/login', (req, res)=>{
        console.log(req.body)

        personAlreadyExistsQuery = 
        `
        SELECT MOBILE_NUMBER, PASSWORD
        FROM PERSON
        WHERE MOBILE_NUMBER = :mobile_number 
        AND PASSWORD = :password
        `

        PersonInfo = {
            mobile_number : req.body.mobile_number,
            password: req.body.password
        }

        console.log(AccountInfo)

        executeQuery(personAlreadyExistsQuery, [req.body.mobile_number])
        .then((record)=>{
            console.log(record)
            if(record.rows.length != 0){
                res.json({serverMsg: 'Logged In Successfully!', 
                            userAccount: PersonInfo})
            }
            else{
                console.log('login failed')
                res.json({serverMsg: 'Login Failed'})
            }
        })
    })
}