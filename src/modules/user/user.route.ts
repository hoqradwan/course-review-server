import express from 'express';
import validateRequest from '../../app/middlewares/validateRequest';
import { userControllers } from './user.controller';
import auth from '../../app/middlewares/auth';
import { USER_ROLE } from './user.constant';
import { userValidations } from './user.validation';

const router = express.Router();

router.post(
    '/auth/register',
    validateRequest(userValidations.registerValidationSchema),
    userControllers.register,
);

router.post(
    '/auth/login',
    validateRequest(userValidations.loginValidationSchema),
    userControllers.loginUser,
);

router.post(
    '/auth/change-password',
    auth(USER_ROLE.admin, USER_ROLE.user),
    validateRequest(userValidations.changePasswordValidationSchema),
    userControllers.changePassword,
);

export const userRoutes = router;