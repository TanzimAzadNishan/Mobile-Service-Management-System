import {baseApi} from '../../ApiControllers/apiCaller'

export default{
    onAddPersonFNF(info){
        return baseApi.post('/add-person-fnf', info)
    },
    onDeletePersonFNF(info){
        return baseApi.post('/delete-person-fnf', info)
    },
    onGetPersonFNF(info){
        return baseApi.post('/retrieve-person-fnf', info)
    }
}