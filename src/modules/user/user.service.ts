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
    const user = await User.findOne({ _id: userData._id }).select('+password +passwordHistory +updatePasswordAt');

    // Check if the user exists
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    // Check if the new password is unique and different from the current and previous two passwords
    const passwordHistory = user.passwordHistory || [];
    const lastTwoPassExists = passwordHistory.slice(-3);
    const isLastTwoPassMatched = await Promise.all(
        lastTwoPassExists.map((elem) => bcrypt.compare(payload.newPassword, elem.password))
    ).then((results) => results.includes(true));
    if (isLastTwoPassMatched) {
        const lastPasswordChange =
            lastTwoPassExists[lastTwoPassExists.length - 1].updatePasswordAt;
        const formattedDate = `${lastPasswordChange.getDate()}-${lastPasswordChange.getMonth() + 1
            }-${lastPasswordChange.getFullYear()} at ${lastPasswordChange.getHours()}:${lastPasswordChange.getMinutes()}`;
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            `Password change failed. Ensure the new password is unique and not among the last 2 used (last used on ${formattedDate}).`
        );
    }
    // Check if the current password is correct
    const isPasswordMatched = await bcrypt.compare(payload.currentPassword, user.password);

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password does not match');
    }
    // Hash and update the new password directly in the query
    const newHashedPassword = await bcrypt.hash(payload.newPassword, Number(config.bcrypt_salt_rounds));
    const passWithUpdatedTime = [
        ...passwordHistory,
        {
            password: newHashedPassword,
            updatePasswordAt: new Date(),
        },
    ];
    await User.findOneAndUpdate(
        { _id: user._id },
        {
            password: newHashedPassword,
            passwordHistory: passWithUpdatedTime,
            updatePasswordAt: new Date(),
        },
        {
            new: true
        }
    );

    return user;
};


export const userServices = {
    register,
    loginUser,
    changePassword,
};