
import dashboardService from '../../utilities/Services/dashboardService'

export const retrieveAccountInfo = (personInfo)=>{
    return(dispatch, getState)=>{
        dashboardService.getAccountInfo(personInfo)
        .then((res)=>{
            console.log(res)

            dispatch({type: 'RETRIEVE_ACCOUNT_DETAILS', accountDetails: res.data.accountDetails})

        }, ()=>{
            console.log('retrieve info failed')
        })
    }
}

export const retrievePackageInfo = ()=>{
    return(dispatch, getState)=>{
        dashboardService.getPackageInfo()
        .then((res)=>{
            console.log(res)

            dispatch({type: 'RETRIEVE_PACKAGE_INFO', packageInfo: res.data.packageInfo})

        }, ()=>{
            console.log('retrieve info failed')
        })
    }
}

export const retrieveFNFInfo = ()=>{
    return(dispatch, getState)=>{
        dashboardService.getFNFInfo()
        .then((res)=>{
            console.log(res)

            dispatch({type: 'RETRIEVE_FNF_INFO', accountInfo: res.data.fnfInfo})

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