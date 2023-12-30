import { z } from 'zod';

const registerValidationSchema = z.object({
    body: z.object({
        username: z.string({ required_error: "username is required" }),
        email: z.string({ required_error: "email is required" }),
        password: z.string({ required_error: 'Password is required' }),
        role: z.string({ required_error: "username is required" }),
    }),
});

const loginValidationSchema = z.object({
    body: z.object({
        username: z.string({ required_error: 'username is required.' }),
        password: z.string({ required_error: 'Password is required' }),
    }),
});

const changePasswordValidationSchema = z.object({
    body: z.object({
        currentPassword: z.string({
            required_error: 'Old password is required',
        }),
        newPassword: z.string({ required_error: 'Password is required' }),
    }),
});





export const userValidations = {
    loginValidationSchema,
    changePasswordValidationSchema,
    registerValidationSchema
};