const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const user_safe_data = ["firstName", "lastName", "photoUrl", "age", "about", "skills", "gender"];


//  Get all pending connection request for the user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({
            status: 'interested',
            toUserId: loggedInUser._id
        }).populate("fromUserId", user_safe_data);
        res.json({message: 'Data fetched successfully', data: requests})
    } catch (err) {
        res.status(400).send("Error: "+err.message);
    }
})


userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const myconnections = await ConnectionRequest.find({
            "$or": [
                {toUserId: loggedInUser._id},
                {fromUserId: loggedInUser._id}
            ],
            "status": "accepted"
        }).populate("fromUserId", user_safe_data)
        .populate("toUserId", user_safe_data);

        const data = myconnections.map((connect) =>  {
            if (connect.fromUserId._id.toString() === loggedInUser._id.toString())
                return connect.toUserId;
            return connect.fromUserId;
        });

        res.json({data: data});

    } catch (err) {
        res.status(400).send("Error: "+error);
    }
})


userRouter.get('/user/feed', userAuth, async (req, res) => {
    try {
        let limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;
        limit = limit > 50 ? 50:limit;
        const loggedInUser = req.user;

        const exclude = await ConnectionRequest.find({
            "$or": [ {"toUserId": loggedInUser._id}, {"fromUserId": loggedInUser._id}]
        }, {toUserId: 1, fromUserId: 1});


        let excludedSet = new Set();
        exclude.forEach((id) => {
            excludedSet.add(id.fromUserId);
            excludedSet.add(id.toUserId);
        })
        excludedSet.add(loggedInUser._id)
        excludedSet = Array.from(excludedSet);

        const users = await User.find({
            _id: {"$nin": excludedSet}
        }).select(user_safe_data).skip(skip).limit(limit)
        res.json({data: users})
    } catch (err) {
        res.status(400).send("Error: "+err.message);
    }
})

module.exports = userRouter