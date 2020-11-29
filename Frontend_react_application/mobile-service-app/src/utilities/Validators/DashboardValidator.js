import validator from 'validator'

const validateName = (name)=>{
    /*if (validator.isEmpty(name)) {
        return 'Name is required';
    }*/
    var regex = /^[a-zA-Z0-9$_ ]*$/ 
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
    /*if (validator.isEmpty(password)) {
      return 'Password is required';
    }*/ 
    if (!validator.isLength(password, { min: 8 })) {
      return 'Password should be minimum 8 characters';
    }
    else if (!validator.isLength(password, { max: 12 })) {
        return 'Password should be maximum 12 characters';
    }
    return false;
}

const validateEmail = (email)=>{
    if (validator.isEmpty(email)) {
        return false;
    }
    else if(!validator.isEmail(email)){
        return 'Invalid Email'
    }
    return false
}

const validateAddress = (address)=>{
    if (!validator.isLength(address, { max: 50 })) {
        return 'Address should be maximum 50 characters';
    }
    return false    
}

const validatePhoto = (photo)=>{
    if (!validator.isLength(photo, { max: 20 })) {
        return 'File Name should be maximum 20 characters';
    }
    return false 
}

const validateCurrentPKG = (pkg)=>{
    if (validator.isEmpty(pkg)) {
        return 'Package is required';
    }
    return false 
}

export {
    validateName, validatePassword, validateEmail, validateAddress,
    validatePhoto, validateCurrentPKG
}