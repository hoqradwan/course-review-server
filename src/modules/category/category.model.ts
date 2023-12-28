import { Schema, model } from "mongoose";
import { TCategory } from "./category.interface";


// Mongoose Schema for Category
const categorySchema = new Schema<TCategory>({
    name: {
        type: String,
        required: true,
        unique: true,
    },
});

export const Category = model<TCategory>('Category', categorySchema);

