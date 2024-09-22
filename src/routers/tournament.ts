import { createTournament, getTournaments, updateTournament } from 'controllers/tournament';
import express from 'express';

const router = express.Router();

router.post('/create', createTournament);

router.post('/update', updateTournament);

router.post('/get', getTournaments);

export default router;
