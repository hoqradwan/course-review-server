import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import { userServices } from "./user.service";

const register = catchAsync(async (req, res) => {
    const result = await userServices.register(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in succesfully!',
        data: result
    });
});
const loginUser = catchAsync(async (req, res) => {
    const result = await userServices.loginUser(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User is logged in succesfully!',
        data: result
    });
});

const changePassword = catchAsync(async (req, res) => {
    const { ...passwordData } = req.body;

    const result = await userServices.changePassword(req.user, passwordData);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password is updated succesfully!',
        data: result,
    });
});

export const userControllers = {
    register,
    loginUser,
    changePassword,

};