import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = ({userDOB, getDOB})=>{
    
    var userChosenDate = (userDOB === '') ? null : new Date(userDOB)
 
    const [startDate, setStartDate] = useState(userChosenDate);

    const passDatatoParent = (date)=>{

        if(date){
            var dateStr = date.toString()
            var timeArr = dateStr.split(' ')
    
            var dateFmtOracle = timeArr[2] + '-' + timeArr[1] + '-' + timeArr[3]
            getDOB(dateFmtOracle)
        }
        setStartDate(date)
    }

    return (
        <DatePicker
            placeholderText={`Date of Birth`} 
            selected={startDate} 
            onChange={date => passDatatoParent(date)} 
        />
    )
}

export default Calendar