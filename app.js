//jshint esversion:6

// Express and configuration
const express = require("express");
const dotenv = require('dotenv');
const app = express();

// Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// Utils
const path = require('path')
const AppError = require('./utils/appError');
const cookieParser = require('cookie-parser');
const errorController = require('./controllers/errorController');

// Session Store
const redis = require('redis');
const session = require('express-session');
const RedisStore = require('connect-redis')(session)

// Configuration file
dotenv.config({ path: './config.env' });

app.set('trust proxy', 1);

// Static Floder
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Session store
let redisClient = redis.createClient({
    host: 'localhost',
    port: 6379
});

app.use(session({
    store: new RedisStore({ client: redisClient}),
    secret: 'HONGS_SECRET',
    reseave: false,      // Don't not update or overwrite the session existing
    saveUnitialized: false,   // 
    // cookie:{
    //     secure: true,    // Only send back cookies to requests over https
    //     httpOnly: true,  // Prevents client side JS from reading the cookie
    //     maxAge: 10800000 // 3hours
    // }
}));


// Routes
app.use('/', userRoutes);
app.use('/user', userRoutes);
app.use('/twits', postRoutes);


// Not Found
app.use('*', (req, res, next) => {
    next(new AppError(`Not Found!`, 404));
});

// Error handlers
app.use(errorController)

module.exports = app;
