import {baseApi, multipartApi} from '../ApiControllers/apiCaller'

export default{
    getAccountInfo(){
        return baseApi.get('/dashboard')
    },
    onEditPersonDetails(personInfo){
        return baseApi.post('/dashboard/edit/person-details', personInfo)
    },
    onEditProfilePic(profilePicInfo){
        return multipartApi.post('/dashboard/edit/profile-Pic', profilePicInfo)
    },
    onEditCurrentPackage(pkgInfo){
        return baseApi.post('/dashboard/edit/current-package', pkgInfo)
    },
    onEditCurrentFNFPlan(fnfInfo){
        return baseApi.post('/dashboard/edit/current-fnf-plan', fnfInfo)
    }
}