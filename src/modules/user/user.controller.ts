import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { userServices } from "./user.service";

const register = catchAsync(async (req, res) => {
    const result = await userServices.register(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User registered succesfully!',
        data: {
            _id: result._id,
            username: result.username,
            email: result.email,
            role: result.role,
            createdAt: result?.createdAt,
            updatedAt: result?.updatedAt
        }
    });
});
const loginUser = catchAsync(async (req, res) => {
    const result = await userServices.loginUser(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in succesfully!',
        data: {
            user: {
                _id: result.user._id,
                username: result.user.username,
                email: result.user.email,
                role: result.user.role,
            },
            token: result.accessToken
        },
    });
});

const changePassword = catchAsync(async (req, res) => {
    // const { ...passwordData } = req.body;
    const result = await userServices.changePassword(req.user, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password changed successfully',
        data: {
            _id: result._id,
            username: result.username,
            email: result.email,
            role: result.role,
            createdAt: result.createdAt,
            updatedAt: result.updatedAt
        },
    });
});

export const userControllers = {
    register,
    loginUser,
    changePassword
};