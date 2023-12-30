import express from "express";
import { categoryControllers } from "./category.controller";
import validateRequest from "../../app/middlewares/validateRequest";
import { categoryValidations } from "./category.validation";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../app/middlewares/auth";
const router = express.Router();

router.post('/categories', auth('admin'), validateRequest(categoryValidations.createCategoryValidationSchema), categoryControllers.createCategory);
router.get('/categories', categoryControllers.getAllCategories);

export const categoryRoutes = router;