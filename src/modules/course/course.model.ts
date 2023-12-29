import mongoose from "mongoose";
import { TCourse, TDetails, TTag } from "./course.interface";

const tagSchema = new mongoose.Schema<TTag>({
    name: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});

const detailsSchema = new mongoose.Schema<TDetails>({
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const courseSchema = new mongoose.Schema<TCourse>({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    instructor: {
        type: String,
        required: true,
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // referring to category model
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    tags: [tagSchema],
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    language: {
        type: String,
        required: true,
    },
    provider: {
        type: String,
        required: true,
    },
    durationInWeeks: {
        type: Number,
    },
    details: detailsSchema,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // referring to category model
        required: true
    }
});
courseSchema.pre('save', function (next) {
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    const durationInMilliseconds = Number(end) - Number(start);
    this.durationInWeeks = Math.ceil(durationInMilliseconds / (7 * 24 * 60 * 60 * 1000));
    next();
});
export const Course = mongoose.model('Course', courseSchema);

