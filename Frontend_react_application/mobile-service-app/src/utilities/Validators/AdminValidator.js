import validator from 'validator'

var passwordGiven = ''

const validateNID = (NID)=>{
    if(validator.isEmpty(NID)){
        return 'NID is required';
    }
    var regex = /^[0-9]*$/ 
    if (!regex.test(NID)) {
        return 'NID should consist of digits only';
    }
    else if (!validator.isLength(NID, { min: 10 })) {
        return 'NID should be 10 digits';
    }
    else if (!validator.isLength(NID, { max: 10 })) {
        return 'NID should be 10 digits';
    }
    return false
}

const validatePassword = (password)=> {
    passwordGiven = password
    if (validator.isEmpty(password)) {
      return 'Password is required';
    } 
    else if (!validator.isLength(password, { min: 8 })) {
      return 'Password should be minimum 8 characters';
    }
    else if (!validator.isLength(password, { max: 12 })) {
        return 'Password should be maximum 12 characters';
    }
    return false;
}

export {
    validateNID, validatePassword
}