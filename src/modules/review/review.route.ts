import express from "express";
import { reviewControllers } from "./review.controller";
const router = express.Router();
router.post('/reviews', reviewControllers.createReview);
router.get('/course/best', reviewControllers.bestCourse);

export const reviewRoutes = router;
