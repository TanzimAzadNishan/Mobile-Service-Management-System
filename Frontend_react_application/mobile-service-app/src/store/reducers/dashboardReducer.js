
const initState = {
    personInfo: null,
    accountInfo: null,
    profilePic: null,
    current_pkg: null,
    current_fnf_plan: null
}

const dashboardReducer = (state = initState, action)=>{
    const accInStore = localStorage.getItem('accountInfo')
    const pkgInStore = localStorage.getItem('current_pkg')
    const fnfInStore = localStorage.getItem('current_fnf_plan')    
    const infoInStore = localStorage.getItem('personInfo')
    const dpInStore = localStorage.getItem('profilePic')


    if(action.type === 'RETRIEVE_ACCOUNT_DETAILS'){
        console.log('account details retrieved')

        localStorage.setItem('accountInfo', JSON.stringify(action.accountDetails.accountInfo))
        localStorage.setItem('current_pkg', JSON.stringify(action.accountDetails.packageInfo))
        localStorage.setItem('current_fnf_plan', JSON.stringify(action.accountDetails.fnfInfo))
        localStorage.setItem('personInfo', JSON.stringify(action.accountDetails.personInfo))
        localStorage.setItem('profilePic', JSON.stringify(action.accountDetails.personInfo.photo))
        
        const accountData = localStorage.getItem('accountInfo')
        const packageData = localStorage.getItem('current_pkg')
        const fnfData = localStorage.getItem('current_fnf_plan')
        const personData = localStorage.getItem('personInfo')
        const profilePicData = localStorage.getItem('profilePic')

        return{
            ...state,
            accountInfo: accountData ? JSON.parse(accountData) : null,
            current_pkg: packageData ? JSON.parse(packageData) : null,
            current_fnf_plan: fnfData ? JSON.parse(fnfData) : null,
            personInfo: personData ? JSON.parse(personData) : null,
            profilePic: profilePicData ? JSON.parse(profilePicData) : null
        }
    }

    else if(action.type === 'EDIT_PERSON_DETAILS'){
        console.log('person details edited')
        localStorage.setItem('personInfo', JSON.stringify(action.personInfo))
        const personData = localStorage.getItem('personInfo')
        return{
            ...state,
            personInfo: personData ? JSON.parse(personData) : null
        }
    }

    else if(action.type === 'EDIT_PROFILE_PIC'){
        console.log('profile pic uploaded')
        localStorage.setItem('profilePic', JSON.stringify(action.profilePic))
        const profilePicData = localStorage.getItem('profilePic')
        return{
            ...state,
            profilePic: profilePicData ? JSON.parse(profilePicData) : null
        }
    }

    else if(action.type === 'EDIT_CURRENT_PKG'){
        console.log('current pkg edited')
        localStorage.setItem('currentPKG', JSON.stringify(action.package))
        const currentPKGData = localStorage.getItem('currentPKG')
        return{
            ...state,
            current_pkg: currentPKGData ? JSON.parse(currentPKGData) : null
        }
    }
    
    else if(action.type === 'EDIT_CURRENT_FNF_PLAN'){
        console.log('current fnf plan edited')
        localStorage.setItem('currentFNF', JSON.stringify(action.fnfPlan))
        const currentFNFData = localStorage.getItem('currentFNF')
        return{
            ...state,
            current_fnf_plan: currentFNFData ? JSON.parse(currentFNFData) : null
        }
    }

    //return state
    return{
        ...state,
        accountInfo: accInStore ? JSON.parse(accInStore) : null,
        current_pkg: pkgInStore ? JSON.parse(pkgInStore) : null,
        current_fnf_plan: fnfInStore ? JSON.parse(fnfInStore) : null,
        personInfo: infoInStore ? JSON.parse(infoInStore) : null,
        profilePic: dpInStore ? JSON.parse(dpInStore) : null
    }
}

export default dashboardReducer