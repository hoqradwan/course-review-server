import { Request, Response } from "express";
import { reviewServices } from "./review.service";
import sendResponse from "../../app/utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";

const createReview = catchAsync(async (req: Request, res: Response) => {
    const result = await reviewServices.createReviewIntoDB(req.user, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Review is created succesfully',
        data: {
            _id: result.review._id,
            courseId: result.review.courseId,
            rating: result.review.rating,
            review: result.review.review,
            createdBy: {
                _id: result.userData._id,
                username: result.userData.username,
                email: result.userData.email,
                role: result.userData.role,
            },
            createdAt: result.review.createdAt,
            updatedAt: result.review.updatedAt
        }
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

