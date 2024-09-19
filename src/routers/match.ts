import { createMatch, getMatch, updateMatch } from 'controllers/match';
import express from 'express';

const router = express.Router();

router.post('/create', createMatch);

router.post('/update', updateMatch);

router.post('/get', getMatch);

export default router;
