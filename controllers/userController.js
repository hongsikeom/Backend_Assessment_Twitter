const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError');
const User = require("../model/userModel");



exports.getMain = (req, res, next) => {
    res.status(200);
    res.write("Backend Assessment _ Task-1 _ Twitter like webserver");
    res.send();
}


exports.signUp = catchAsync(async (req, res, next) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        }).catch(err => {
            // If user already exists
            if (err.code === 11000){
                return next(new AppError("Email is already exist", 401))
            }});

        req.session.key = newUser.email;
        req.user = newUser;

        res.status(201).json({
            status: 'success',
            message: 'You are successfully signed up!'
        });

    } catch(err) {
        return next(new AppError("Something went wrong!", 401));
    }
});



// Login
exports.login = catchAsync(async (req, res, next) => {
    try {
        const { email, password }  = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide ID and Password!', 400));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || (!await user.correctPassword(password, user.password))) {
            console.log('here');
            return next(new AppError('Incorrect ID or Password', 401));
        }

        req.session.key = user.email;
        req.user = user;

        res.status(201).json({
            status: 'success',
            message: 'You are successfully Logged in!'
        });
    } catch (err) {
        return next(new AppError('Something went wrong!', 401));
    }
});



// Log out
exports.logout = (req, res) => {
    req.session.destroy(function (err){
        if (err) {
            return next(new AppError('Something wen wrong!', 401));
        } else {
            res.status(200).json({
                status: 'success',
                message: 'You are successfully logged out!'
            });
        }
    });
};



// Check if the user is logged in
exports.isLoggedIn = catchAsync(async (req, res, next) => {
    try{
        if (req.session.key) {
            const currentUser = await User.findOne({email: req.session.key})
            req.user = currentUser;
        } else {
            return next(new AppError('You are not logged! Please log in before access the conents', 401));
        }
        next();
    } catch (err) {
        return next(new AppError('You are not logged! Please log in before access the conents', 401));
    }
});
