import mongoose, { Schema } from 'mongoose';
import { PasswordChangeHistory, TUser, UserModel } from './user.interface';
import bcrypt from 'bcrypt';
import config from '../../app/config';
const PasswordChangeHistorySchema = new Schema<PasswordChangeHistory>(
    {
        hashedPassword: {
            type: String,
            required: true,
        },
        timestamps: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false } // This ensures that Mongoose won't create a separate _id for each history entry
);
const userSchema = new Schema<TUser, UserModel>({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    updatePasswordAt: {
        type: Date,
        default: null,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    // passwordChangeHistory: [PasswordChangeHistorySchema]
    passwordHistory: [
        {
            password: String,
            updatePasswordAt: Date,
        },
    ],

}, {
    timestamps: true
});

userSchema.pre('save', async function (next) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const user = this; // doc
    // hashing password and save into DB
    user.password = await bcrypt.hash(
        user.password,
        Number(config.bcrypt_salt_rounds),
    );
    next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
userSchema.statics.isUserExists = async function (username: string) {
    const existingUser = await User.findOne({ username })
    return existingUser;
}
const User = mongoose.model<TUser, UserModel>('User', userSchema);

export default User;
