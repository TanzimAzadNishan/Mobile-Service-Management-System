import validator from 'validator'

const validateName = (name)=>{
    if (validator.isEmpty(name)) {
        return 'Name is required';
    }
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

const validateGender = (gender)=>{

}

const validateEmail = (email)=>{
    if(!validator.isEmail(email)){
        return 'Invalid Email'
    }
    return false
}

const validateAddress = (address)=>{
    if (!validator.isLength(password, { max: 50 })) {
        return 'Address should be maximum 50 characters';
    }
    return false    
}

const validateDOB = (dob)=>{

}

const validatePhoto = (photo)=>{
    
}

const validateCurrentPKG = (pkg)=>{

}

const validateCurrentFNFPlan = (plan)=>{

}

export {
    validateName, validatePassword, validateGender, validateEmail, validateAddress,
    validateDOB, validatePhoto, validateCurrentPKG, validateCurrentFNFPlan
}