import {baseApi} from '../../ApiControllers/apiCaller'

export default{
    getAccountBalance(personInfo){
        return baseApi.post('/flexiplan/get-balance',personInfo)
    },
    updateAccount(planDetails){
        return baseApi.post('/flexiplan/update-account', planDetails)
    }
}