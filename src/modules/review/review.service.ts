import { JwtPayload } from "jsonwebtoken";
import { Course } from "../course/course.model";
import { TReview } from "./review.interface";
import { Review } from "./review.model";

const createReviewIntoDB = async (userData: JwtPayload, payload: TReview) => {
    const review = await Review.create(payload);
    // await result.populate('createdBy', '_id username email role');
    return { review, userData };
}
const getBestCourseFromDB = async () => {
    const bestCourse = await Course.aggregate([
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'courseId',
                as: 'reviews',
            },
        },
        {
            $lookup: {
                from: 'users', // Replace with the actual collection name for users
                localField: 'createdBy',
                foreignField: '_id',
                as: 'createdBy',
            },
        },
        {
            $unwind: '$createdBy',
        },
        {
            $project: {
                _id: 1,
                title: 1,
                instructor: 1,
                categoryId: 1,
                price: 1,
                tags: 1,
                startDate: 1,
                endDate: 1,
                language: 1,
                provider: 1,
                durationInWeeks: 1,
                details: 1,
                createdBy: {
                    id: '$createdBy._id',
                    username: '$createdBy.username',
                    email: '$createdBy.email',
                    role: '$createdBy.role',
                },
                averageRating: { $avg: '$reviews.rating' },
                reviewCount: { $size: '$reviews' },
            },
        },
        { $sort: { averageRating: -1 } },
        { $limit: 1 },
    ]);

    return bestCourse;
};

export const reviewServices = {
    createReviewIntoDB,
    getBestCourseFromDB
}