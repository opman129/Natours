const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        trim: true,
        required: [true, 'Please enter your fullname'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        trim: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email']
    },
    photo: {
        type: String,
        default: 'avatar.jpg'
    },
    roles: {
        type: String,
        enum: ["admin", "user", "guide"],
        default: "user"
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minLength: 5,
        maxlength: 15,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: 'Please ensure your passwords are the same'
        },
    },
    lastLoginDate: {
        type: Date,
        default: Date.now()
    },
    ResetToken: String,
    ResetExpires: Date,
    id: false
}, {    timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
});

userSchema.pre('save', async function(next) {
    /** Run if password was modified */
    if (!this.isModified('password')) {
        return next();
    };

    /** Hash the password */
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function (password, userPassword) {
    return await bcrypt.compare(password, userPassword);
};

userSchema.methods.createPasswordResetToken = function() {
    const token = crypto.randomBytes(2).toString('hex');

    this.ResetToken = crypto
        .createHash('sha256')
        .update(token).digest('hex');

    this.ResetExpires = Date.now() + 10 * 60 * 1000;
    return token;
};

/** Find only active users */
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
})

// userSchema.virtual(^/\\/)
const User = mongoose.model("User", userSchema);
module.exports = User;

/** DATA MODELLING 
 * 
 * ONE TO ONE RELATIONSHIPS
 * ONE TO MANY RELATIONSHIPS
 * MANY TO MANY RELATIONSHIPS
 */
