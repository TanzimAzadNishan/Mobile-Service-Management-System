//admin actions creator

import adminService from '../../utilities/Services/adminService'

export const loginAdmin = (accountInfo)=>{
    return(dispatch, getState)=>{
        adminService.onAdminLogin(accountInfo)
        .then((res)=>{
            console.log(res)
            if(res.data.serverMsg === 'NID or Password is wrong'){
                dispatch({type: 'ADMIN_LOGIN_FAILED', error: res.data.serverMsg})
            }
            else{
                dispatch({type: 'ADMIN_LOGIN_SUCCESS', adminAccount: res.data.adminAccount})
            }
        }, ()=>{
            console.log('error occured')
        })
    }
}

export const adminlogoutFromAccount = ()=>{
    return{
        type: 'ADMIN_LOGOUT'
    }
}

