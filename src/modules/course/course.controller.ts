import { Request, Response } from "express";
import { courseServices } from "./course.service";
import sendResponse from "../../app/utils/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../app/utils/catchAsync";

const createCourse = catchAsync(async (req: Request, res: Response) => {
    const courseData = req.body;
    const result = await courseServices.createCourseIntoDB(courseData);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Course is created succesfully',
        data: result
    })
})
const getAllCourses = catchAsync(async (req: Request, res: Response) => {
    const { courses, metadata } = await courseServices.getAllCoursesFromDB(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Courses are retrieved succesfully',
        meta: metadata,
        data: courses
    })
})

const getSingleCourseWithReview = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const result = await courseServices.getSingleCourseWithReviewFromDB(courseId);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Courses is retrieved with reviews succesfully',
        data: result
    })
})
const updateCourse = catchAsync(async (req: Request, res: Response) => {
    const { courseId } = req.params;
    const updateData = req.body;
    const result = await courseServices.updateCourseIntoDB(courseId, updateData);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Courses is updated succesfully',
        data: result
    })
})


export const courseControllers = {
    createCourse,
    getAllCourses,
    getSingleCourseWithReview,
    updateCourse,
}