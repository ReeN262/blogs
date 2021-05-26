const express = require('express')
const userRouter = require('./Routes/userRoutes')
const authRouter = require('./Routes/auth')



const PORT = 8080;
const app = express()

// const url = require('url');
// const params = new url.URLSearchParams({ foo: 'bar' });
// axios.post('http://something.com/', params.toString());

app.use(express.json())

app.use('/', userRouter)
app.use('/auth', authRouter)
 
app.listen(PORT)