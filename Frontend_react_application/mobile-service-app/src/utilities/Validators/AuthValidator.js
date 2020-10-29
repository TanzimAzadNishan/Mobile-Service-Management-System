import validator from 'validator'

var passwordGiven = ''

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

const validateName = (name)=>{
    if (validator.isEmpty(name)) {
        return 'Name is required';
    }
    var regex = /^[a-zA-Z0-9$_ ]*$/ 
    //var regex = /^[a-zA-Z_]([[a-zA-Z0-9$_ ]*)$/ 
    var nonLetterRegex = /^[0-9$_ ]*$/ 
    if (nonLetterRegex.test(name)) {
        return 'name should contain letters';
    }
    else if (!regex.test(name)) {
        return 'Invalid Name';
    }
    return false;
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

const validateConfirmPassword = (con_pass)=>{
    if (validator.isEmpty(con_pass)) {
        return 'This field is required';
    }
    else if(!validator.equals(con_pass, passwordGiven)){
        return 'This field is not matched with Password field'
    }
    return false 
}

export {
    validateMobileNumber, validateName, validatePassword, validateConfirmPassword
}