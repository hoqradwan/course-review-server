import express from 'express';
import { AuthValidation } from './auth.validation';
import validateRequest from '../../app/middlewares/validateRequest';
import { userControllers } from './user.controller';
import auth from '../../app/middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidation.loginValidationSchema),
    userControllers.loginUser,
);

router.post(
    '/change-password',
    auth(USER_ROLE.admin, USER_ROLE.user),
    validateRequest(AuthValidation.changePasswordValidationSchema),
    userControllers.changePassword,
);

export const userRoutes = router;