const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    DOB: {
        type: Date,
        required: true  
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'other']
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
