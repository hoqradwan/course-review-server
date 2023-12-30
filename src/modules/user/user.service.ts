import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';


import AppError from '../../app/errors/AppError';
import { TLoginUser, TUser } from './user.interface';
import { createToken } from './user.utils';
import User from './uaer.model';
import config from '../../app/config';
const register = async (payload: TUser) => {
    const user = await User.create(payload);

    //create token and sent to the  client

    const jwtPayload = {
        userId: user._id,
        role: user.role,
        email: user.email,  // User's email
    };

    createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );



    return user;
};

const loginUser = async (payload: TLoginUser) => {
    // checking if the user is exist
    const user = await User.isUserExists(payload.username);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }
    // console.log('Provided Password:', payload.password);
    // console.log('User Password:', user.password);
    const isPasswordMatched = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
    }


    const jwtPayload: {
        id: string;      // Make sure the type matches the expected type for id
        email: string;   // Make sure the type matches the expected type for email
        role: string;    // Make sure the type matches the expected type for role
    } = {
        id: user._id,    // Assuming user._id is a string
        email: user.email,
        role: user.role,
    };


    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );


    return {
        user,
        accessToken
    };
};

const changePassword = async (
    userData: JwtPayload,
    payload: { oldPassword: string; newPassword: string },
) => {
    // checking if the user is exist
    const user = await User.findById(userData.userId);

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
    }

    //checking if the password is correct
    const isPasswordMatched = await bcrypt.compare(payload.oldPassword, user.password);


    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
    }


    //hash new password
    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );
    console.log(newHashedPassword);
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