import express from "express";
import { reviewControllers } from "./review.controller";
import auth from "../../app/middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
const router = express.Router();
router.post('/reviews', auth(USER_ROLE.user), reviewControllers.createReview);
router.get('/course/best', reviewControllers.bestCourse);

export const reviewRoutes = router;
