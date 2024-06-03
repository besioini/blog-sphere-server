const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

const app = express();

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
    origin: 'http://127.0.0.1:5173',
    credentials: true, // to allow cookies to be sent
};
app.use(cors(corsOptions));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes)

module.exports = app;
