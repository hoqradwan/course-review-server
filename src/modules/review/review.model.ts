import mongoose, { Schema, model } from 'mongoose';
import { TReview } from './review.interface';

// Interface for Review Schema


// Mongoose Schema for Review
const reviewSchema = new Schema<TReview>({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'Course', // Assuming there is a 'Course' model
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    review: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
});

// Mongoose Model for Review
export const Review = model<TReview>('Review', reviewSchema);

