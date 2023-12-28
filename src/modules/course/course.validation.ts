import { z } from 'zod';

// Zod schema for the Tag
const createTagValidationSchema = z.object({
    name: z.string(),
    isDeleted: z.boolean().default(false),
});

// Zod schema for the Details
const createDetailsValidationSchema = z.object({
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
    description: z.string(),
});

// Zod schema for the Course
const createCourseValidationSchema = z.object({
    body: z.object({
        title: z.string(),
        instructor: z.string(),
        categoryId: z.string(), // Adjust the type based on your actual use case
        price: z.number(),
        tags: z.array(createTagValidationSchema),
        startDate: z.string(),
        endDate: z.string(),
        language: z.string(),
        provider: z.string(),
        details: createDetailsValidationSchema,
    })
});
// Zod schema for the Tag
const updateTagValidationSchema = z.object({
    name: z.string().optional(),
    isDeleted: z.boolean().default(false),
});

// Zod schema for the Details
const updateDetailsValidationSchema = z.object({
    level: z.enum(['Beginner', 'Intermediate', 'Advanced']).optional(),
    description: z.string().optional(),
});

// Zod schema for the Course
const updateCourseValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        instructor: z.string().optional(),
        categoryId: z.string().optional(), // Adjust the type based on your actual use case
        price: z.number().optional(),
        tags: z.array(updateTagValidationSchema).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        language: z.string().optional(),
        provider: z.string().optional(),
        details: updateDetailsValidationSchema.optional(),
    })
});
export const courseValidations = {
    createCourseValidationSchema,
    updateCourseValidationSchema
}