import validator from 'validator'


const validateFeedbackBody = (body)=>{
    if (validator.isEmpty(body)) {
        return 'Feedback body is required';
    }
    return false 
}

export{
    validateFeedbackBody
}