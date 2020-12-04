
const initState = {
    feedbackReplyList: null
}

const feedbackReducer = (state = initState, action)=>{
    const replyListInStore = localStorage.getItem('feedbackReplyList')

    if(action.type === 'STORE_ALL_FEEDBACK_REPLIES'){
        console.log('feedback reply list stored')

        localStorage.setItem('feedbackReplyList', JSON.stringify(action.replyInfo))
        const replyListData = localStorage.getItem('feedbackReplyList')

        return{
            ...state,
            feedbackReplyList: replyListData ? JSON.parse(replyListData) : null
        }
    }
    
    return{
        ...state,
        feedbackReplyList: replyListInStore ? JSON.parse(replyListInStore) : null
    }
}

export default feedbackReducer