import { Types } from "mongoose";

export type TTag = {
    name: string;
    isDeleted: boolean;
}

export type TDetails = {
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    description: string;
}

// Interface for Course Schema
export type TCourse = {
    title: string;
    instructor: string;
    categoryId: Types.ObjectId;
    price: number;
    tags: TTag[];
    startDate: string;
    endDate: string;
    language: string;
    provider: string;
    durationInWeeks: number;
    details: TDetails;
}
