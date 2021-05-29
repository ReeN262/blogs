const express = require('express')
const passport = require('passport')
const userRouter = require('./Routes/userRoutes')
const authRouter = require('./Routes/authRoutes')
const postRouter = require('./Routes/postRoutes')

const PORT = 8080;
const app = express()

app.use(express.json())

app.use(passport.initialize())
require('./middleware/passport')(passport)
app.use('/account', userRouter)
app.use('/auth',authRouter)
app.use('/post', postRouter)
 
app.listen(PORT)