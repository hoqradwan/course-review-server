/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import notFound from './app/middlewares/notFound';
// import router from './app/routes';
import { courseRoutes } from './modules/course/course.route';
import { categoryRoutes } from './modules/category/category.route';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import { reviewRoutes } from './modules/review/review.route';
import { userRoutes } from './modules/user/user.route';

const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use('/api', courseRoutes);
app.use('/api', categoryRoutes);
app.use('/api', reviewRoutes);
app.use('/api', userRoutes);

const test = async (req: Request, res: Response) => {
  const a = 10;
  res.json({ data: a })
};

app.get('/', test);

app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;