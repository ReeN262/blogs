const express = require('express');
const passport = require('passport');

const userRouter = require('./Routes/userRoutes');
const authRouter = require('./Routes/authRoutes');
const postRouter = require('./Routes/postRoutes');
const commentRouter = require('./Routes/commentRoutes');

const PORT =  process.env.PORT || 8080;
const app = express();

app.use(express.json());

app.use(passport.initialize());
require('./middleware/passport')(passport);
app.use('/image/', express.static('image/'));

//routers
app.use('/account', userRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/post/comment', commentRouter);

app.get('/', (req, res) => {
  res.send('error');
});
 
app.listen(PORT , () => console.log('Server start'));