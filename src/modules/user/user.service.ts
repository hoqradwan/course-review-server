import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import AppError from '../../app/errors/AppError';
import { TLoginUser, TUser } from './user.interface';
import User from './uaer.model';
import config from '../../app/config';
const register = async (payload: TUser) => {
    const user = await User.create(payload);
    return user;
};

const loginUser = async (payload: TLoginUser) => {
    const { username } = payload;
    // checking if the user is exist
    const user = await User.findOne({ username }).select('+password');
    // console.log(user?.password, user?._id)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
    // console.log(isPasswordMatched)
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
    }

    const jwtPlayload = {
        _id: user._id,
        username: user.username,
        role: user.role,
        email: user.email
    };
    const accessToken = jwt.sign(
        jwtPlayload,
        config.jwt_access_secret as string,
        { expiresIn: '7d' },
    );

    return {
        user,
        accessToken
    };
};

const changePassword = async (
    userData: JwtPayload,
    payload: { currentPassword: string; newPassword: string },
) => {
    // Find the user and select the hashed password
    const user = await User.findOne({ _id: userData._id }).select('+password +passwordChangeHistory');
    console.log(user)
    // Check if the user exists
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    // Check if the current password is correct
    const isPasswordMatched = await bcrypt.compare(payload.currentPassword, user.password);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
    }
    // Check if the new password is unique and different from the current and previous two passwords
    const isNewPasswordValid = user.passwordChangeHistory.every((entry) => {
        return !bcrypt.compareSync(payload.newPassword, entry.hashedPassword);
    });

    if (!isNewPasswordValid) {
        throw new Error('New password does not meet the requirements');
    }

    // Hash and update the new password directly in the query
    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));
    // Update the user's password and password change history
    user.passwordChangeHistory.push({
        hashedPassword: newHashedPassword,
        timestamps: Date.now(),
    });
    await User.findOneAndUpdate(
        { _id: user._id },
        { password: newHashedPassword }
    );

    return user;
};


export const userServices = {
    register,
    loginUser,
    changePassword,
};


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NThmN2RhZTE2YmNkMTVjYTFiZjYyMWYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDM5MDI3MzUsImV4cCI6MTcwMzk4OTEzNX0.swiY6QZoMhZ84QdPmOZ3LhQw0JZybz_ODZkmUK_aTTE


// const changePassword = async (
//     userData: JwtPayload,
//     payload: { currentPassword: string; newPassword: string },
// ) => {
//     const user = await AuthModel.findOne({ _id: userData._id }).select(
//         '+password',
//     );


//     if (!user) {
//         throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
//     }

//     const isPasswordMatch = await bcrypt.compare(
//         payload.currentPassword,
//         user.password,
//     );

//     if (!isPasswordMatch) {
//         throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
//     }

//     const newHashedPassword = await bcrypt.hash(
//         payload.newPassword,
//         Number(config.bcrypt_salt_rounds),
//     );

//     const result = await AuthModel.findByIdAndUpdate(userData._id, {
//         password: newHashedPassword,
//         needsPasswordChange: false,
//         passwordChangedAt: new Date(),
//     });

//     return result;
// };

// const loginUser = async (username: string, password: string) => {
//     const user = await AuthModel.findOne({ username }).select('+password');
//     if (!user) {
//         throw new Error('User not found');
//     }
//     const isPasswordMatch = await bcrypt.compare(password, user.password);
//     if (!isPasswordMatch) {
//         throw new Error('Incorrect password');
//     }
//     const jwtPlayload = {
//         _id: user._id,
//         username: user.username,
//         role: user.role,
//     };
//     const accessToken = jwt.sign(
//         jwtPlayload,
//         config.jwt_access_secret_token as string,
//         { expiresIn: '7d' },
//     );

//     return {
//         accessToken,
//         user,
//     };
// };

// const createUserIntoDB = async (user: Tuser) => {
//     const saltRounds = 12;
//     const hashedPassword = await bcrypt.hash(user.password, saltRounds);
//     user.password = hashedPassword;
//     const result = await AuthModel.create(user);
//     return result;
// };