import {baseApi} from './ApiControllers/apiCaller'

export default{
    onSignup(signupInfo){
        return baseApi.post('/signup', signupInfo)
    }
}