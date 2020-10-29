const executeQuery = require('../../Database/oracleSetup')
const getRandomId = require('../../Database/idGenerator')

module.exports = function(app, upload){
    app.post('/dashboard/edit-info', (req, res)=>{
        console.log(req.body)

        EditPersonQuery = 
        `
        UPDATE PERSON
        SET NAME = :name, PASSWORD = :password, GENDER = :gender, EMAIL = :email, 
        ADDRESS = :address, DOB = :dob, 
        CURRENT_FNF_PLAN = :current_fnf_plan
        WHERE MOBILE_NUMBER = :mobile_number
        `

        EditPersonInfo = {
            name: req.body.name, 
            password: req.body.password, 
            gender: req.body.gender, 
            email: req.body.email, 
            address: req.body.address, 
            dob: req.body.dob, 
            current_fnf_plan: req.body.current_fnf_plan, 
            mobile_number: req.body.mobile_number 
        }
        
        executeQuery(EditPersonQuery, EditPersonInfo)
        .then(()=>{

            delete EditPersonInfo.mobile_number
            res.json({serverMsg: 'Information Edited Successfully',
                    personInfo: EditPersonInfo})
        })
    })

    app.post('/dashboard/edit-profile-Pic', upload.single('file') , (req, res)=>{
        console.log(req.body)

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
                    profilePic: req.body.photo})
        })
    })
}