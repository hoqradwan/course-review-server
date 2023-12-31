/* eslint-disable @typescript-eslint/no-explicit-any */
import { TCourse } from "./course.interface";
import { Course } from "./course.model";
import { Review } from "../review/review.model";

const createCourseIntoDB = async (payload: TCourse) => {
    const result = await Course.create(payload);
    return result;
}
const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
    const {
        page = 1,
        limit = 10,
        sortBy,
        sortOrder = 'asc',
        minPrice,
        maxPrice,
        tags,
        startDate,
        endDate,
        language,
        provider,
        durationInWeeks,
        level
    }: Record<string, unknown> = query;
    const filter: any = {};
    interface Metadata {
        page: number;
        limit: number;
        total: number;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
        filter.price = {};
        if (minPrice !== undefined) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice !== undefined) filter.price.$lte = parseFloat(maxPrice);
    }

    if (tags) {
        filter['tags.name'] = tags; // Assuming you want to filter by tag name
    }

    if (startDate || endDate) {
        filter.startDate = {};
        if (startDate) filter.startDate.$gte = new Date(startDate as string);
        if (endDate) filter.startDate.$lte = new Date(endDate as string);
    }

    if (language) filter.language = language;
    if (provider) filter.provider = provider;
    if (durationInWeeks) filter.durationInWeeks = parseInt(durationInWeeks as string, 10);
    if (level) filter['details.level'] = level;

    const sortOptions = {};
    if (sortBy) sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;


    const courses = await Course.find(filter)
        .populate({ path: "createdBy", select: '_id username email role' })
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(parseInt(limit as string, 10))
        .exec();

    const totalCourses = await Course.countDocuments(filter);
    const metadata: Metadata = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        total: totalCourses,
    };

    return { courses, metadata };
}

const getSingleCourseWithReviewFromDB = async (courseId: string) => {
    const course = await Course.findById(courseId).populate({ path: "createdBy", select: '_id username email role' });

    if (!course) {
        throw new Error('Course not found');
    }

    const reviews = await Review.find({ courseId: course._id }).populate({ path: "createdBy", select: '_id username email role' });
    return {
        course,
        reviews,
    };
};

const updateCourseIntoDB = async (courseId: string, payload: Partial<TCourse>) => {
    const { details, ...remainingUpdateData } = payload;
    const modifiedUpdatedData: Record<string, unknown> = {
        ...remainingUpdateData
    }
    if (details && Object.keys(details).length) {
        for (const [key, value] of Object.entries(details)) {
            modifiedUpdatedData[`details.${key}`] = value;
        }
    }

    const result = await Course.findByIdAndUpdate(courseId, { $set: modifiedUpdatedData }, { new: true, runValidators: true }).populate(
        'createdBy',
        '-password -passwordHistory -updatePasswordAt -createdAt -updatedAt -__v -id',
    );
    return result;
}

export const courseServices = {
    createCourseIntoDB,
    getAllCoursesFromDB,
    getSingleCourseWithReviewFromDB,
    updateCourseIntoDB,
}



