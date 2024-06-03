const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sendResponse, sendError, isValidEmail, isValidPassword, isValidPhoneNumber } = require('../utils');

const register = async (req, res) => {
    try {
        const { firstname, lastname, contact, password, DOB, gender} = req.body;

        if(!(isValidEmail(contact) || isValidPhoneNumber(contact))){
            return sendError(res, 400, 'Invalid email or phone number');
        };
        if(!isValidPassword(password)){
            return sendError(res, 400, 'Password must be at least 8 characters');
        }

        hashedPassword = await bcrypt.hash(password, 12);
        const user = new User({
            firstname, lastname, contact, password: hashedPassword, DOB, gender
        });

        const exist = await User.findOne({ contact });

        if (exist) {
            console.log('User already registered')
            return sendError(res, 409, 'User already registered');
        }

        await user.save();

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/',
            maxAge: 3600000
        });

        console.log('Register successful'),
        sendResponse(res, 201, {
            message: 'Register successful',
            token,
            user
        })
    } catch (err) {
        console.error(err.message)
        sendError(res, 500, 'Register Failure')
    }
}

const login = async(req, res) => {
    try {
        const { contact, password } = req.body;

        if(!(isValidEmail(contact) || isValidPhoneNumber(contact))){
            return sendError(res, 400, 'Invalid email or phone number');
        };
        if(!isValidPassword(password)){
            return sendError(res, 400, 'Password must be at least 8 characters');
        }

        const user = await User.findOne({ contact });

        if(!user) {
            return sendError(res, 404, 'User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return sendError(res, 400, 'Invalid credentials');
        }

        const token = jwt.sign(
            { _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )
        
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            path: '/',
            maxAge: 3600000
        });

        console.log('Login successful'),
        sendResponse(res, 201, {
            message: 'Login successful',
            token,
            user
        })

    }catch(err) {
        console.error('Login Error', err.message);
        sendError(res, 500, 'Login Failure')
    }
}

module.exports = { register, login }

