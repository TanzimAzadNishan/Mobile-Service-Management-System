import validator from 'validator'


const validateMobileNumber = (mob_num)=>{
    if(validator.isEmpty(mob_num)){
        return 'Mobile Number is required';
    }
    var regex = /^[0-9]*$/ 
    if (!regex.test(mob_num)) {
        return 'Mobile Number should consist of digits only';
    }
    else if (!validator.isLength(mob_num, { min: 11 })) {
        return 'Mobile Number should be 11 digits';
    }
    else if (!validator.isLength(mob_num, { max: 11 })) {
        return 'Mobile Number should be 11 digits';
    }
    return false
}

const validateAmount = (amount)=>{
    if(validator.isEmpty(amount)){
        return 'Amount is required';
    }
    var regex = /^[0-9]*$/ 
    if (!regex.test(amount)) {
        return 'Amount should consist of digits only';
    }
    return false
}

export{ validateMobileNumber, validateAmount}