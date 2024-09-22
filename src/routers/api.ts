import { getResource } from 'controllers/api';
import express from 'express';

const router = express.Router();

router.post('/resource', getResource);

export default router;
