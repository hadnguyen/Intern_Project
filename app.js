const express = require('express');
const passport = require('passport');
const userRoute = require('./routes/user.route');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.json());

app.use(passport.initialize());
require('./config/passport');

app.use('/api/v1/users', userRoute);

app.use(errorHandler);

module.exports = app;
