const mongoose = require("mongoose");
const User = require("./user");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    status: {
        type: 'String',
        required: true,
        enum: {
            values: ["ignore", "interested", "accepted", "rejected"],
            message: props => `${props.value} is not a valid status type`
        }
    }
}, {
    timestamps: true
});

// compound index to make the query faster
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })

// middleware
connectionRequestSchema.pre("save", function(next) {
    const connectionReq = this;
    // check if from is same as to
    if (connectionReq.fromUserId.equals(connectionReq.toUserId)) 
        throw new Error("Cannot send connection request to yourself");

    next();
});

const ConnectionRequest = new mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnectionRequest;