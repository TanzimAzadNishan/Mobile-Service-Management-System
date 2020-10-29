import {baseApi, multipartApi} from '../ApiControllers/apiCaller'

export default{
    onAccountInfo(){
        return baseApi.get('/dashboard')
    },
    onEditInfo(editInfo){
        return baseApi.post('/dashboard/edit-info', editInfo)
    },
    onEditProfilePic(profilePicInfo){
        return multipartApi.post('/dashboard/edit-profile-Pic', profilePicInfo)
    }
}