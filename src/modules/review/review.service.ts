import { Course } from "../course/course.model";
import { TReview } from "./review.interface";
import { Review } from "./review.model";

const createReviewIntoDB = async (payload: TReview) => {
    const result = await Review.create(payload);
    return result;
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
                averageRating: { $avg: '$reviews.rating' },
                reviewCount: { $size: '$reviews' },
            },
        },
        { $sort: { averageRating: -1 } },
        { $limit: 1 },
    ]);
    return bestCourse;
}
export const reviewServices = {
    createReviewIntoDB,
    getBestCourseFromDB
}