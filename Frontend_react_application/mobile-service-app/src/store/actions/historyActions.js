
import historyService from '../../utilities/Services/historyService'

export const retrieveHistoryInfo = (personInfo) => {
    return(dispatch, getState) => {
        historyService.getHistory(personInfo)
        .then((res)=> {
            console.log(res)
            if(res.data.serverMsg === 'History Information Retrieved'){
                dispatch({type: 'RETRIEVE_HISTORY_DETAILS', historyInfo: res.data.historyInfo})
            } 
        }, ()=>{
            console.log('retrieve info failed')
        })
    }
}

export const updateHistoryInfo = (historyInfo) => {
    return(dispatch, getState) => {
        dispatch({type: 'UPDATE_HISTORY_DETAILS', historyInfo: historyInfo})
    }
}
