import {baseApi} from '../ApiControllers/apiCaller'

export default{
    onAdminLogin(loginInfo){
        return baseApi.post('/admin/login', loginInfo)
    }
}