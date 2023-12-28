import express from "express";
import { courseControllers } from "./course.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import { courseValidations } from "./course.validation";
const router = express.Router();

router.post('/course', validateRequest(courseValidations.createCourseValidationSchema), courseControllers.createCourse);
router.put('/courses/:courseId', validateRequest(courseValidations.updateCourseValidationSchema), courseControllers.updateCourse);
router.get('/courses', courseControllers.getAllCourses);
router.get('/courses/:courseId/reviews', courseControllers.getSingleCourseWithReview);
export const courseRoutes = router;