import {baseApi} from '../../ApiControllers/apiCaller'

export default{
    updateAccount(planDetails){
        return baseApi.post('/flexiplan/update-account', planDetails)
    }
}