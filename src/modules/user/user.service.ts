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
    console.log(user)

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // console.log('Provided Password:', payload.password);
    // console.log('User Password:', user.password);
    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
    console.log(isPasswordMatched)
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
    }


    // const jwtPayload: {
    //     id: string;      // Make sure the type matches the expected type for id
    //     email: string;   // Make sure the type matches the expected type for email
    //     role: string;    // Make sure the type matches the expected type for role
    // } = {
    //     id: user._id,    // Assuming user._id is a string
    //     email: user.email,
    //     role: user.role,
    // };


    // const accessToken = createToken(
    //     jwtPayload,
    //     config.jwt_access_secret as string,
    //     config.jwt_access_expires_in as string,
    // );
    const jwtPlayload = {
        _id: user._id,
        username: user.username,
        role: user.role,
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
    // const user = await User.findOne({ _id: userData._id }).select(
    //     '+password',
    // );
    // checking if the user is exist
    const user = await User.findOne(userData.userId).select('+password');
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    //checking if the password is correct
    const isPasswordMatched = await bcrypt.compare(payload.currentPassword, user.password);


    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
    }


    //hash new password
    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );
    user.password = newHashedPassword;
    await user.save();

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