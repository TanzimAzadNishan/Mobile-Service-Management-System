// action creator

import authService from '../../utilities/Services/authService'

export const createAccount = (accountInfo)=>{
    return(dispatch, getState)=>{
        authService.onSignup(accountInfo)
        .then((res)=>{
            console.log(res)
            if(res.data.serverMsg === 'User Already Exists'){
                dispatch({type: 'SIGNUP_FAILED', error: res.data.serverMsg})
            }
            else{
                dispatch({type: 'SIGNUP_SUCCESS', userAccount: res.data.userAccount})
            }
        }, ()=>{
            console.log('error occured')
        })
    }
}


export const logoutFromAccount = ()=>{
    return{
        type: 'LOGOUT'
    }
}