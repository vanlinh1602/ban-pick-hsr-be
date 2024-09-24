import {
  createTournament,
  getTournaments,
  saveBracket,
  updateTournament,
} from 'controllers/tournament';
import express from 'express';

const router = express.Router();

router.post('/create', createTournament);

router.post('/update', updateTournament);

router.post('/get', getTournaments);

router.post('/saveBracket', saveBracket);

export default router;
