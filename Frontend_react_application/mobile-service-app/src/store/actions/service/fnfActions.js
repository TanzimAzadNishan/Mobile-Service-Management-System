import fnfService from '../../../utilities/Services/Service/fnfService'

export const retrievefnfInfo = (fnfInfo) => {
    return(dispatch, getState) => {
        fnfService.getfnf(fnfInfo)
        .then((res)=> {
            console.log(res)
            if(res.data.serverMsg === 'fnf Information Retrieved'){
                dispatch({type: 'RETRIEVE_FNF_DETAILS', fnfInfo: res.data.fnfInfo})
            }
            
        }, ()=>{
            console.log('retrieve info failed')
        })
    }
}

export const updatefnfInfo = (fnfDetails) => {
    return() => {
        fnfService.updatefnf(fnfDetails)
    }
}