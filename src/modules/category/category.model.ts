import mongoose, { Schema, model } from "mongoose";
import { TCategory } from "./category.interface";


// Mongoose Schema for Category
const categorySchema = new Schema<TCategory>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // referring to category model
        required: true
    }
});

export const Category = model<TCategory>('Category', categorySchema);

