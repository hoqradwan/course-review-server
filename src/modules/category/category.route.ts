import express from "express";
import { categoryControllers } from "./category.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import { categoryValidations } from "./category.validation";
const router = express.Router();

router.post('/categories', validateRequest(categoryValidations.createCategoryValidationSchema), categoryControllers.createCategory);
router.get('/categories', categoryControllers.getAllCategories);

export const categoryRoutes = router;