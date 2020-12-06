import {baseApi} from '../../ApiControllers/apiCaller'

export default{
    getOffers(OfferInfo){
        return baseApi.post('/offer', OfferInfo)
    },
    getBalance(personInfo){
        return baseApi.post('/offer/get-balance',personInfo)
    },
    updateAccountOffer(offerDetails){
        return baseApi.post('/offer/buy', offerDetails)
    }
}