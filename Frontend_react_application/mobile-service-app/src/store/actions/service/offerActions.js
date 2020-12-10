import offerService from '../../../utilities/Services/Service/offerService'

export const retrievePopularOfferInfo = (popular) => {
    return(dispatch, getState) => {
        offerService.getpopular(popular)
        .then((res)=> {
            console.log(res)
            if(res.data.serverMsg === 'popular offer Information Retrieved'){
                dispatch({type: 'RETRIEVE_POPULAR_OFFER_DETAILS', popular: res.data.popular})
            }
            
        }, ()=>{
            console.log('retrieve info failed')
        })
    }
}

export const retrieveOfferInfo = (offerInfo) => {
    return(dispatch, getState) => {
        offerService.getOffers(offerInfo)
        .then((res)=> {
            console.log(res)
            if(res.data.serverMsg === 'offer Information Retrieved'){
                dispatch({type: 'RETRIEVE_OFFER_DETAILS', offerInfo: res.data.offerInfo})
            }
            
        }, ()=>{
            console.log('retrieve info failed')
        })
    }
}

export const retrieveAccountBalance = (personInfo)=>{
    return(dispatch, getState)=>{
        offerService.getBalance(personInfo)
        .then((res)=>{
            console.log(res.data)
            dispatch({type: 'RETRIEVE_PERSON_BALANCE_POINTS', personInfo: res.data.personInfo})

        }, ()=>{
            console.log('retrieve account balance failed')
        })
    }
}

export const updateAccountOffer = (offerDetails) => {
    return() => {
        offerService.updateAccountOffer(offerDetails)
    }
}