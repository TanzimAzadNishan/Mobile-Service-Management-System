const executeQuery = require('../../Database/oracleSetup')
const compareHash = require('../../Database/compareHash')

module.exports = function(app){
    app.post('/login', (req, res)=>{
        console.log('login...........', req.body)

        personAlreadyExistsQuery = 
        `
        SELECT MOBILE_NUMBER, PASSWORD, NAME
        FROM PERSON
        WHERE MOBILE_NUMBER = :mobile_number
        `

        findNameQuery = 
        `
        SELECT NAME
        FROM PERSON
        WHERE MOBILE_NUMBER = :mobile_number
        `

        PersonInfo = {
            mobile_number : req.body.mobile_number
        }


        executeQuery(personAlreadyExistsQuery, PersonInfo)
        .then((record)=>{
            console.log(record)
            if(record.rows.length != 0){

                var hashedPassword = record.rows[0].PASSWORD
                PersonInfo.name = record.rows[0].NAME
                PersonInfo.password = req.body.password

                try{
                    compareHash(PersonInfo.password, hashedPassword)
                    .then((isMatched)=>{
                        console.log('check matching ', isMatched)
                        console.log('check matching ', hashedPassword)
                        console.log('check matching ', PersonInfo.password)

                        if (isMatched){
                            res.json({serverMsg: 'Logged In Successfully!', 
                            userAccount: PersonInfo})
                        }
                    })
                }
                catch(err){
                    console.error(err)
                }

                /*executeQuery(findNameQuery, [req.body.mobile_number])
                .then((nameRecord)=>{
                    console.log(nameRecord)

                    PersonInfo.name = nameRecord.rows[0].NAME

                    res.json({serverMsg: 'Logged In Successfully!', 
                    userAccount: PersonInfo})
                })*/
            }
            else{
                console.log('login failed')
                res.json({serverMsg: 'Mobile Number or Password is wrong'})
            }
        })
    })
}