import { Request, Response } from "express";
import { categoryServices } from "./category.service";
import catchAsync from "../../app/utils/catchAsync";
import sendResponse from "../../app/utils/sendResponse";
import httpStatus from "http-status";

const createCategory = catchAsync(async (req: Request, res: Response) => {
    const categoryData = req.body;
    const result = await categoryServices.createCategoryIntoDB(categoryData);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: 'Category is created succesfully',
        data: result
    })

})
const getAllCategories = async (req: Request, res: Response) => {
    const result = await categoryServices.getAllCategoriesFromDB();
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: 'Categories are retrieved succesfully',
        data: result
    })
}
export const categoryControllers = {
    createCategory,
    getAllCategories
}