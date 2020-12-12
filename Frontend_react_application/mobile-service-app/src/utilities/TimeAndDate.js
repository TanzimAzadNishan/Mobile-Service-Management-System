
/*const getMonth = (mon)=>{
    if(mon === ''){ return }
    else if(mon === 'Jan'){ return '01'}
    else if(mon === 'Feb'){ return '02'}
    else if(mon === 'Mar'){ return '03'}
    else if(mon === 'Apr'){ return '04'}
    else if(mon === 'May'){ return '05'}
    else if(mon === 'Jun'){ return '06'}
    else if(mon === 'Jul'){ return '07'}
    else if(mon === 'Aug'){ return '08'}
    else if(mon === 'Sep'){ return '09'}
    else if(mon === 'Oct'){ return '10'}
    else if(mon === 'Nov'){ return '11'}
    else if(mon === 'Dec'){ return '12'}
}*/

const getDate = (str)=>{
    var dateStr = new Date(str)
    /*var dateSplit = dateStr.split(' ')
    var month = getMonth(dateSplit[1])
    var year = dateSplit[3]
    var day = dateSplit[2]
    var time = dateSplit[4]*/

    /*var month = dateStr.getMonth()
    var year =  dateStr.getFullYear()
    var day = dateStr.getDay()
    var hr = dateStr.getHours()
    var min = dateStr.getMinutes()
    var sec = dateStr.getSeconds()*/

    //var dateFmt = day + '-' + month + '-' + year + ' ' + hr + ':' + min + ':' + sec
    return dateStr.toLocaleDateString() + ' ' + dateStr.toLocaleTimeString()
}

const getDuration = (time1, time2)=>{
    var milisec = new Date(time2) - new Date(time1)
    console.log('duration : ', milisec)
    var sec = Math.floor(milisec / 1000) % 60
    var min = Math.floor(milisec /(1000 * 60)) % 60
    var hr = Math.floor(milisec / (1000 * 60 * 60))
    var secFlag = '', minFlag = '', hrFlag = ''
    if(sec < 10){ secFlag = '0' }
    if(min < 10){ minFlag = '0' }
    if(hr < 10){ hrFlag = '0' }

    return hrFlag + hr + ':' + minFlag + min + ':' + secFlag + sec
}

const getRechargeValidity = (rechargeDate)=>{
    var actionDate = new Date(rechargeDate)
    actionDate.setDate(actionDate.getDate() + 30)

    console.log(actionDate)
    return actionDate.toLocaleDateString()
}


const getValidityDate = (dateStr)=>{

    if(dateStr != null){
        var actionDate = new Date(dateStr)

        console.log(actionDate)
        return actionDate.toLocaleDateString()+ ' ' + actionDate.toLocaleTimeString()
    }
    return null
}

export {getDate, getDuration, getRechargeValidity, getValidityDate}