const express = require('express');
const bcrypt = require('bcrypt');
const validator = require('validator');
const profileRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
const User = require('../models/user');
const user = require('../models/user');


profileRouter.get("/profile/view", userAuth, (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(400).send("Error:"+ err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key]
        });
        loggedInUser.save(); // either update like this
        // await User.updateOne({_id: loggedInUser._id}, {'$set': {...loggedInUser}}) // or use mongoose updateOne api
        res.send("Update successful")
    } catch (err) {
        res.status(400).send("Coudn't update, error: ", err.message)
    }
})

profileRouter.patch("/profile/password", userAuth, async(req, res) => {
    try {
        // userAuth middleware authenticated the user
        const { password } = req.body;
        if (!password) {
            throw new Error('Invalid edit request');
        }
        if (!validator.isStrongPassword(password)) {
            throw new Error('Please enter a strong password!')
        }
        const user = req.user;
        // isValidPass = await user.verifyPassword(user.password);
        // if (!isValidPass)
        const hashed = await bcrypt.hash(password, 10);
        user.password = hashed;
        await user.save();
        res.send('Password changed successfully')
    } catch(err) {
        res.status(400).send('Error updating password: '+ err.message);
    }
})


module.exports = profileRouter;