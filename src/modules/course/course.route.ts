import express from "express";
import { courseControllers } from "./course.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import { courseValidations } from "./course.validation";
import auth from "../../app/middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
const router = express.Router();

router.post('/course', auth(USER_ROLE.admin), validateRequest(courseValidations.createCourseValidationSchema), auth(USER_ROLE.admin), courseControllers.createCourse);
router.put('/courses/:courseId', validateRequest(courseValidations.updateCourseValidationSchema), courseControllers.updateCourse);
router.get('/courses', courseControllers.getAllCourses);
router.get('/courses/:courseId/reviews', courseControllers.getSingleCourseWithReview);
export const courseRoutes = router;