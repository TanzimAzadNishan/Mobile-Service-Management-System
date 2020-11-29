const executeQuery = require('../../Database/queryIntoDB')
//const getRandomId = require('../../Database/idGenerator')

module.exports = function(app, upload){
    app.post('/dashboard/edit/person-details', (req, res)=>{
        console.log(req.body)

        EditPersonQuery =
        `
        UPDATE PERSON
        SET NAME = :name, PASSWORD = :password, EMAIL = :email,  
        DOB = :dob, GENDER = :gender, ADDRESS = :address
        WHERE MOBILE_NUMBER = :mobile_number
        `

        EditPersonInfo = {
            name: req.body.name, 
            password: req.body.password,  
            email: req.body.email,  
            dob: req.body.dob,
            gender: req.body.gender,
            address: req.body.address, 
            mobile_number: req.body.mobile_number 
        }
        
        executeQuery(EditPersonQuery, EditPersonInfo)
        .then(()=>{

            delete EditPersonInfo.mobile_number
            res.json({serverMsg: 'Information Edited Successfully',
                    personInfo: EditPersonInfo})
        })
    })

    app.post('/dashboard/edit/profile-Pic', upload.single('file') , (req, res)=>{
        console.log(req.body)
        console.log('file name: ', req.requestTime)

        //var fileExt = req.file.name.split('.')[1]
        var fileExt = req.file.originalname.split('.')[1]

        EditProfilePicQuery = 
        `
        UPDATE PERSON
        SET PHOTO = :photo
        WHERE MOBILE_NUMBER = :mobile_number
        `
        EditProfilePicInfo = {
            photo: `${req.requestTime}.${fileExt}`,
            mobile_number: req.body.mobile_number
        }

        executeQuery(EditProfilePicQuery, EditProfilePicInfo)
        .then(()=>{

            res.json({serverMsg: 'Profile Picture Uploaded Successfully',
                    profilePic: EditProfilePicInfo.photo})
        })
    })
}