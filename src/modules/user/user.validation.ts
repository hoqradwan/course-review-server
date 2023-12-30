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
        oldPassword: z.string({
            required_error: 'Old password is required',
        }),
        newPassword: z.string({ required_error: 'Password is required' }),
    }),
});



const forgetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({
            required_error: 'User id is required!',
        }),
    }),
});

// const resetPasswordValidationSchema = z.object({
//     body: z.object({
//         id: z.string({
//             required_error: 'User id is required!',
//         }),
//         newPassword: z.string({
//             required_error: 'User password is required!',
//         }),
//     }),
// });

export const userValidations = {
    loginValidationSchema,
    changePasswordValidationSchema,
    registerValidationSchema
};