const express = require('express')
const userRouter = require('./Routes/userRoutes')
const authRouter = require('./Routes/authRoutes');
const passport = require('passport');

const PORT = 8080;
const app = express()

app.use(express.json())

app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use('/account', userRouter)
app.use('/auth',authRouter)
 
app.listen(PORT)