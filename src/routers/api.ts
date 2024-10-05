import { auth, getResource, signOut, updateConfigs } from 'controllers/api';
import express from 'express';

const router = express.Router();

router.post('/auth', auth);

router.post('/signOut', signOut);

router.post('/resource', getResource);

router.post('/updateConfigs', updateConfigs);

export default router;
