import { Request, Response } from "express";
import { reviewServices } from "./review.service";
import sendResponse from "../../app/utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const result = await reviewServices.createReviewIntoDB(req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Review is created succesfully',
        data: result
    })
})
const bestCourse = catchAsync(async (req: Request, res: Response) => {

    const result = await reviewServices.getBestCourseFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Best course is retrieved succesfully',
        data: result
    })
})

export const reviewControllers = {
    createReview,
    bestCourse
}

