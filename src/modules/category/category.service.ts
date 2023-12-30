import { TCategory } from "./category.interface";
import { Category } from "./category.model";


const createCategoryIntoDB = async (payload: TCategory) => {
    const result = await Category.create(payload);
    return result;
}
const getAllCategoriesFromDB = async () => {
    const result = await Category.find().populate({ path: "createdBy", select: '_id username email role' });
    return result;
}
export const categoryServices = {
    createCategoryIntoDB,
    getAllCategoriesFromDB
}