import { createMatch, getMatch, queryMatches, updateMatch } from 'controllers/match';
import express from 'express';

const router = express.Router();

router.post('/create', createMatch);

router.post('/update', updateMatch);

router.post('/get', getMatch);

router.post('/query', queryMatches);

export default router;
