import flexiplanService from '../../../utilities/Services/Service/flexiplanService'

export const retrieveAccountBalance = (personInfo)=>{
    return(dispatch, getState)=>{
        flexiplanService.getAccountBalance(personInfo)
        .then((res)=>{
            console.log(res.data)

            dispatch({type: 'RETRIEVE_PERSON_BALANCE', personInfo: res.data.personInfo})

        }, ()=>{
            console.log('retrieve account balance failed')
        })
    }
}

export const updateAccountInfo = (planDetails) => {
    return() => {
        flexiplanService.updateAccount(planDetails)
    }
}

