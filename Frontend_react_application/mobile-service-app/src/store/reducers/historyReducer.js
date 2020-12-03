const initstate = {
    historyInfo : null
}

const historyReducer = (state = initstate, action)=>{
    if (action.type === 'RETRIEVE_HISTORY_DETAILS'){
        console.log('history details retrieved')

        localStorage.setItem('historyInfo', JSON.stringify(action.historyInfo))

        const historyData = localStorage.getItem('historyInfo')

        return{
            ...state,
            historyInfo: historyData ? JSON.parse(historyData) : null
        }
    }

    return state
}

export default historyReducer