import express from 'express';
import userRouter from './router/userRoute';
const router = express.Router();

router.use('/api/user', userRouter);

export default router;
