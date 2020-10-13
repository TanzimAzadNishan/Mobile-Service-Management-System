// action creator

import authService from '../../services/authService'

export const createAccount = (accountInfo)=>{
    return(dispatch, getState)=>{
        authService.onSignup(accountInfo)
        .then((data)=>{
            console.log(data)
            dispatch({type: 'CREATE_ACCOUNT', userAccount: data})
        }, ()=>{
            console.log('error occured')
        })
    }
}