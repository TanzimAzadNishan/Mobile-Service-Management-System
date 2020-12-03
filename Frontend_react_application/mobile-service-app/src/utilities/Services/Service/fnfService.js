import {baseApi} from '../../ApiControllers/apiCaller'

export default{
    getfnf(fnfInfo){
        return baseApi.post('/fnf', fnfInfo)
    },
    updatefnf(fnfDetails){
        return baseApi.post('/fnf/set', fnfDetails)
    }
}
