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

        findNameQuery = 
        `
        SELECT NAME
        FROM PERSON
        WHERE MOBILE_NUMBER = :mobile_number
        `

        PersonInfo = {
            mobile_number : req.body.mobile_number,
            password: req.body.password
        }

        executeQuery(personAlreadyExistsQuery, PersonInfo)
        .then((record)=>{
            console.log(record)
            if(record.rows.length != 0){

                executeQuery(findNameQuery, [req.body.mobile_number])
                .then((nameRecord)=>{
                    console.log(nameRecord)

                    PersonInfo.name = nameRecord.rows[0].NAME

                    res.json({serverMsg: 'Logged In Successfully!', 
                    userAccount: PersonInfo})
                })
            }
            else{
                console.log('login failed')
                res.json({serverMsg: 'Mobile Number or Password is wrong'})
            }
        })
    })
}