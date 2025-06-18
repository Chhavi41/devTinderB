const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: {
            values: ["male", "female", "others"],
            message: props => `${props.value} is not a valid gender type`
        }
        // validate(value) {
        //     if (!["male", "female", "others"].includes(value)) {
        //         throw new Error("Gender data is not valid");
        //     }
        // }
    },
    photoUrl: {
        type: String
    },
    about: {
        type: String
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true,
});

userSchema.methods.getJWT = async function() {
    // const user = this;
    const token = await jwt.sign({_id: this._id}, 'jwtsecret', {
        expiresIn: "7d"
    });
    return token;
}

userSchema.methods.verifyPassword = async function(passwordInputByUser) {
    const passwordHash = this.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

module.exports = mongoose.model("User", userSchema)