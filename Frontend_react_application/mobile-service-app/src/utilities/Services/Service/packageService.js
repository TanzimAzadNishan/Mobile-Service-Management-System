import {baseApi} from '../../ApiControllers/apiCaller'

export default{
    getPackages(packageInfo){
        return baseApi.post('/package', packageInfo)
    },
    updatePackage(packageDetails){
        return baseApi.post('/package/set', packageDetails)
    }
}
