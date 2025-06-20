require('dotenv').config();
const express = require("express");
const connectDB = require('./config/database');
const cookieParser = require("cookie-parser");
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB().then(() => {
    console.log('connected to db');
    app.listen(PORT, () => {
        console.log('Listening on port '+ PORT)
    });
}).catch((err) => {
    console.error('error connecting to db: '+err)
});