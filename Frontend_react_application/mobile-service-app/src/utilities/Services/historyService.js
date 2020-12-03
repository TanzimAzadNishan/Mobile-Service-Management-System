import {baseApi} from '../ApiControllers/apiCaller'

export default{
    getHistory(personInfo){
        return baseApi.post('/history', personInfo)
    }
}