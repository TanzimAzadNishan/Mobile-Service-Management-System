
import adminDashboardService from '../../utilities/Services/adminDashboardService'

export const retrieveAdminInfo = (adminInfo)=>{
    return(dispatch, getState)=>{
        adminDashboardService.getAdminInfo(adminInfo)
        .then((res)=>{
            console.log(res.data)

            dispatch({type: 'RETRIEVE_ADMIN_ACCOUNT_DETAILS', adminInfo: res.data.adminInfo})

        }, ()=>{
            console.log('retrieve admin info failed')
        })
    }
}

export const setNewPackage = (newPkg)=>{
    return()=>{
        adminDashboardService.setNewPackage(newPkg)
    }
}

export const editPackage = (editPkg)=>{
    return()=>{
        adminDashboardService.editPackage(editPkg)
    }  
}

export const deletePackage = (editPkg)=>{
    return()=>{
        adminDashboardService.deletePackage(editPkg)
    }  
}

export const setNewfnf = (newfnf)=>{
    return()=>{
        adminDashboardService.setNewfnf(newfnf)
    }
}

export const editFnf = (editfnf)=>{
    return()=>{
        adminDashboardService.editFnf(editfnf)
    }  
}

export const deletefnf = (editfnf)=>{
    return()=>{
        adminDashboardService.deletefnf(editfnf)
    }  
}

export const setNewOffer = (newOffer)=>{
    return()=>{
        adminDashboardService.setNewOffer(newOffer)
    }
}

export const editOffer = (editedOffer)=>{
    return()=>{
        adminDashboardService.editOffer(editedOffer)
    }  
}

export const deleteOffer = (editedOffer)=>{
    return()=>{
        adminDashboardService.deleteOffer(editedOffer)
    }  
}
