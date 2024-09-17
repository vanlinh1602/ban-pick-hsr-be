import { getGameRecords } from 'controllers/hoyolab';
import express from 'express';

const router = express.Router();

router.post('/gameRecords', getGameRecords);

export default router;
