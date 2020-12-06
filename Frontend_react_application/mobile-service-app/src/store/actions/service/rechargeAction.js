import rechargeService from '../../../utilities/Services/Service/rechargeService'

export const sendRecharge = (info) => {
    return(dispatch, getState) => {
        rechargeService.onSendRecharge(info)
        .then((res)=> {
            console.log(res)

            if(res.data.serverMsg === 'Your account does not have sufficient balance'){
                dispatch({type: 'RECHARGE_FAILED', error: res.data.serverMsg})
            }
            
        }, ()=>{
            console.log('retrieve feedback list failed')
        })
    }
}