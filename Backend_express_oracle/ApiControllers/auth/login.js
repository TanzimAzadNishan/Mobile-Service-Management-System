const executeQuery = require('../../Database/queryIntoDB')
const hashing = require('../../Database/hashing')

module.exports = function(app){
    app.post('/login', (req, res)=>{
        console.log('login...........', req.body)

        personAlreadyExistsQuery = 
        `
        SELECT MOBILE_NUMBER, PASSWORD, NAME
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

                hashing.compareHash(PersonInfo.password, hashedPassword)
                .then((isMatched)=>{
                    if (isMatched){
                        res.json({serverMsg: 'Logged In Successfully!', 
                        userAccount: PersonInfo})
                    }
                    else{
                        console.log('Password is wrong')
                        res.json({serverMsg: 'Mobile Number or Password is wrong'})
                    }
                })

            }
            else{
                console.log('login failed')
                res.json({serverMsg: 'Mobile Number or Password is wrong'})
            }
        })
    })
}