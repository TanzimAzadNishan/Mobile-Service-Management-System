import packageService from '../../../utilities/Services/Service/packageService'

export const retrievePackageInfo = (packageInfo) => {
    return(dispatch, getState) => {
        packageService.getPackages(packageInfo)
        .then((res)=> {
            console.log(res)
            if(res.data.serverMsg === 'Package Information Retrieved'){
                dispatch({type: 'RETRIEVE_PACKAGE_DETAILS', packageInfo: res.data.packageInfo})
            }
            
        }, ()=>{
            console.log('retrieve info failed')
        })
    }
}

