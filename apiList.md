## authRouter
POST /signup
POST /login
POST /logout

## profileRouter
GET /profile/view
PATCH /profile/edit
PATCH /profile/password

status: ignore, interested, accepted, rejected
## connectionRequestRouter
POST /request/send/interested/:userid
POST /request/send/ignored/:userid
POST /request/review/accepted/:userid
POST /request/review/rejected/:userid

## userRouter
GET /user/connections
GET /user/requests/received
GET /user/feed   - will get the profiles of other users on platform