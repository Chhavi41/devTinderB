const validator = require('validator');

const validateSignUpData = (req) => {
    const {firstName, lastName, emailId, password} = req.body;
    if (!firstName || !lastName) {
        throw new Error("Invalid name")
    } else if (!emailId || !validator.isEmail(emailId)) {
        throw new Error("Invalid emailID");
    } else if (!password || !validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password");
    }
}

const validateEditProfileData = (req) => {
    const allowedEditFields = ['firstName', 'lastName', 'emailId', 
    'photoUrl', 'gender', 'about', 'skills', 'age'];
    const isEditAllowed = Object.keys(req.body).every(field => 
        allowedEditFields.includes(field)
    );
    return isEditAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData
}