
const initState = {
    auth: null,
    authError: null
}

const adminReducer = (state = initState, action)=>{
    const adminAuth = localStorage.getItem('adminAccount')
    console.log('admin: ', adminAuth)

    
    if(action.type === 'LOGIN_SUCCESS'){
        console.log('Admin Logged In')
        console.log(action.adminAccount)
        localStorage.setItem('adminAccount', JSON.stringify(action.adminAccount))
        const adminData = localStorage.getItem('adminAccount')
        console.log(JSON.parse(adminData))
        return{
            ...state,
            auth: adminData ? JSON.parse(adminData) : null
        }
    }

    else if(action.type === 'LOGIN_FAILED'){
        return{
            ...state,
            authError: action.error
        }
    }

    else if(action.type === 'LOGOUT'){
        localStorage.removeItem('adminAccount')
        //location.reload()
        return{
            ...state,
            auth: null
        }
    }
    
    return{
        ...state,
        auth: adminAuth ? JSON.parse(adminAuth) : null
    }
    //return state
}

export default adminReducer;