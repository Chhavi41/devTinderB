const express = require('express');
const requestRouter = express.Router();

const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const authRouter = require('./auth');

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params?.toUserId;
        const status = req.params?.status;

        const allowedStatus = ["ignored", "interested"];
        if (!allowedStatus.includes(status)) {
            throw new Error("invalid status type "+status);
        }

        const existingrequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        if (existingrequest) {
            throw new Error("Connection request already exists!!");
        }

        const isToUserValid = await User.findById(toUserId);
        if (!isToUserValid) {
            throw new Error("User not found");
        }

        const request = new ConnectionRequest({
            fromUserId, toUserId, status
        });
        const data = await request.save();
        res.json({
            message: `${req.user.firstName} is ${status} in ${isToUserValid.firstName}`,
            data
        });
    } catch (err) {
        res.status(400).send('Error: '+err.message);
    }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async(req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;

        const allowedStatus = ['accepted', 'rejected'];
        if (!allowedStatus.includes(status)) {
            throw new Error("invalid status type "+status);
        }
        
        const existingRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested"
    
        });
        if (!existingRequest) {
            throw new Error("Connection request not found");
        }
        existingRequest.status = status;
        const data = await existingRequest.save();
        res.json({message: "Connection Request "+status, data});
    } catch(err) {
        res.status(400).send("Error " + err.message);
    }
});


module.exports = requestRouter;