import {baseApi} from '../ApiControllers/apiCaller'

export default{
    onSignup(signupInfo){
        return baseApi.post('/signup', signupInfo)
    },

    onLogin(loginInfo){
        return baseApi.post('/login',loginInfo)
    }
}