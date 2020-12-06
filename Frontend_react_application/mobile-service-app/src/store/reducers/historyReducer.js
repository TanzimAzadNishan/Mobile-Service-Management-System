const initstate = {
    historyInfo : null
}

const historyReducer = (state = initstate, action)=>{
    const historyinfoinstore =  localStorage.getItem('historyInfo')

    if (action.type === 'RETRIEVE_HISTORY_DETAILS'){
        console.log('history details retrieved')

        localStorage.setItem('historyInfo', JSON.stringify(action.historyInfo))

        const historyData = localStorage.getItem('historyInfo')

        return{
            ...state,
            historyInfo: historyData ? JSON.parse(historyData) : null
        }
    }

    return {
        ...state,
        historyInfo: (historyinfoinstore) ? JSON.parse(historyinfoinstore) : null
    }
}

export default historyReducer