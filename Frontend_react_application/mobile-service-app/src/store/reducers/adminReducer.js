
const initState = {
    ADMINauth: null,
    ADMINauthError: null
}

const adminReducer = (state = initState, action)=>{
    const adminAuth = localStorage.getItem('adminAccount')
    console.log('admin: ', adminAuth)

    
    if(action.type === 'ADMIN_LOGIN_SUCCESS'){
        console.log('Admin Logged In')
        console.log(action.adminAccount)
        localStorage.setItem('adminAccount', JSON.stringify(action.adminAccount))
        const adminData = localStorage.getItem('adminAccount')
        console.log(JSON.parse(adminData))
        return{
            ...state,
            ADMINauth: adminData ? JSON.parse(adminData) : null
        }
    }

    else if(action.type === 'ADMIN_LOGIN_FAILED'){
        return{
            ...state,
            ADMINauthError: action.error
        }
    }

    else if(action.type === 'ADMIN_LOGOUT'){
        localStorage.removeItem('adminAccount')
        //location.reload()
        return{
            ...state,
            ADMINauth: null
        }
    }
    
    return{
        ...state,
        ADMINauth: adminAuth ? JSON.parse(JSON.stringify(adminAuth)) : null
    }
    //return state
}

export default adminReducer;