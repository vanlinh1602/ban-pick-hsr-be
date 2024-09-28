import { getResource, updateConfigs } from 'controllers/api';
import express from 'express';

const router = express.Router();

router.post('/resource', getResource);

router.post('/updateConfigs', updateConfigs);

export default router;
