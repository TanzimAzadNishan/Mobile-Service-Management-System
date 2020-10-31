
import dashboardService from '../../utilities/Services/dashboardService'

export const retrieveAccountInfo = ()=>{
    return(dispatch, getState)=>{
        dashboardService.getAccountInfo()
        .then((res)=>{
            console.log(res)

            dispatch({type: 'RETRIEVE_ACCOUNT_INFO', accountInfo: res.data.accountInfo})

        }, ()=>{
            console.log('retrieve info failed')
        })
    }
}

export const editPersonDetails = (editInfo)=>{
    return(dispatch, getState)=>{
        dashboardService.onEditPersonDetails(editInfo)
        .then((res)=>{
            console.log(res)

            dispatch({type: 'EDIT_PERSON_DETAILS', personInfo: res.data.personInfo})

        }, ()=>{
            console.log('edit profile failed')
        })
    }
}

export const editProfilePic = (profilePicInfo)=>{
    return(dispatch, getState)=>{
        dashboardService.onEditProfilePic(profilePicInfo)
        .then((res)=>{
            console.log(res)

            dispatch({type: 'EDIT_PROFILE_PIC', profilePic: res.data.profilePic})

        }, ()=>{
            console.log('upload profile pic failed')
        })
    }
}

export const editCurrentPackage = (pkgInfo)=>{
    return(dispatch, getState)=>{
        dashboardService.onEditCurrentPackage(pkgInfo)
        .then((res)=>{
            console.log(res)

            dispatch({type: 'EDIT_CURRENT_PKG', package: res.data.package})

        }, ()=>{
            console.log('edit package failed')
        })
    }
}

export const editCurrentFNFPlan = (fnfInfo)=>{
    return(dispatch, getState)=>{
        dashboardService.onEditCurrentFNFPlan(fnfInfo)
        .then((res)=>{
            console.log(res)

            dispatch({type: 'EDIT_CURRENT_FNF_PLAN', package: res.data.fnfPlan})

        }, ()=>{
            console.log('edit fnf plan failed')
        })
    }
}