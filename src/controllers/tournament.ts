import { Request, Response } from 'express';
import { Tournament } from 'services/tournament';
import { validParams } from 'utils/validator';

export const createTournament = async (req: Request, res: Response) => {
  try {
    validParams(req.body, ['data']);
    const { data } = req.body;
    const tournament = {
      ...data,
    };
    const result = await Services.tournaments.createTournament(tournament);
    if (result) {
      const { _id, ...tournamentResult } = result;
      res.send({ id: _id.toString(), ...tournamentResult });
    } else {
      res.status(400).send('Failed to create match');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getTournaments = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    const result = await Services.tournaments.getTournaments(id);
    if (result) {
      const tournaments: CustomObject<Partial<Tournament> & { id: string }> = {};
      result.forEach((tournament) => {
        const { _id, ...tournamentData } = tournament;
        tournaments[_id.toString()] = { ...tournamentData, id: _id.toString() };
      });
      res.send(tournaments);
    } else {
      res.status(404).send('Match not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updateTournament = async (req: Request, res: Response) => {
  try {
    validParams(req.body, ['match']);
    const { match } = req.body;
    const { id, ...matchData } = match;
    const result = await Services.matchs.updateMatch(id, matchData);
    if (!result) {
      res.status(404).send('Failed to update match');
    }
    const { _id, ...matchResult } = result;
    res.send({ id: _id.toString(), ...matchResult });
  } catch (err) {
    res.status(500).send(err);
  }
};
