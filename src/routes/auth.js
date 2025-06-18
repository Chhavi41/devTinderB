const express = require('express');
const bcrypt = require('bcrypt')
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, emailId, password } = req.body;
        const hashedpass = await bcrypt.hash(password, 10);
        const user = new User({
            firstName, lastName, emailId, password: hashedpass
        })
        const savedUser = await user.save();
        const token = await savedUser.getJWT();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 8 * 3600000)
        })
        res.json({message: "User added successfully", data: savedUser})
    } catch(err) {
        res.status(400).send("Error: "+err);
    }

});

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({emailId:emailId});
        console.log(user)
        if (!user) {
            throw new Error("Invalid credentials");
        }
        const isPasswordValid = await user.verifyPassword(password);
        const token = await user.getJWT();
        if (isPasswordValid) {
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8*3600000)
            });
            res.send(user);
        } else {
            throw new Error("Invalid Credentials");
        }
    } catch(err) {
        res.status(400).send("Error: "+err.message);
    }
});

authRouter.post('/logout', (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    }).send('Logout Successful');
})

module.exports = authRouter;