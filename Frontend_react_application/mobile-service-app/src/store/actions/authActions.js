// action creator

import authService from '../../utilities/Services/authService'

export const createAccount = (accountInfo)=>{
    return(dispatch, getState)=>{
        authService.onSignup(accountInfo)
        .then((res)=>{
            console.log(res)
            if(res.data.serverMsg === 'User Already Exists'){
                dispatch({type: 'SIGNUP_FAILED', error: res.data.serverMsg})
                
                setTimeout(()=>{
                    dispatch({type: 'REFRESH_AUTH_ERROR'})
                }, 5000)
            }
            else{
                dispatch({type: 'SIGNUP_SUCCESS', userAccount: res.data.userAccount})
            }
        }, ()=>{
            console.log('error occured')
        })
    }
}

export const loginUser = (accountInfo)=>{
    return(dispatch, getState)=>{
        authService.onLogin(accountInfo)
        .then((res)=>{
            console.log(res)
            if(res.data.serverMsg === 'Mobile Number or Password is wrong'){
                dispatch({type: 'LOGIN_FAILED', error: res.data.serverMsg})
                
                setTimeout(()=>{
                    dispatch({type: 'REFRESH_AUTH_ERROR'})
                }, 5000)
            }
            else{
                dispatch({type: 'LOGIN_SUCCESS', userAccount: res.data.userAccount})
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

export const refreshAuthError = ()=>{
    return{
        type: 'REFRESH_AUTH_ERROR'
    }
}