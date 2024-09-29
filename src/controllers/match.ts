import { Request, Response } from 'express';
import { validParams } from 'utils/validator';

export const createMatch = async (req: Request, res: Response) => {
  try {
    validParams(req.body, ['matchInfo']);
    const { matchInfo } = req.body;
    const match = {
      status: 'set-up',
      ...matchInfo,
    };
    const result = await Services.matches.createMatch(match);
    if (result) {
      res.send({ id: result });
    } else {
      res.status(400).send('Failed to create match');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getMatch = async (req: Request, res: Response) => {
  try {
    validParams(req.body, ['id']);
    const { id } = req.body;
    const result = await Services.matches.getMatch(id);
    if (result) {
      const { _id, ...match } = result;
      res.send({ id: _id.toString(), ...match });
    } else {
      res.status(404).send('Match not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export const queryMatches = async (req: Request, res: Response) => {
  try {
    const { filter } = req.body;
    const result = await Services.matches.queryMatches(filter);
    if (result) {
      res.send(result.map(({ _id, ...match }) => ({ id: _id.toString(), ...match })));
    } else {
      res.status(404).send('Matches not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updateMatch = async (req: Request, res: Response) => {
  try {
    validParams(req.body, ['matches']);
    const { matches } = req.body;

    const result: any[] = await Promise.all(
      matches.map(async (match: any) => {
        const { id, ...matchData } = match;
        const updated = await Services.matches.updateMatch(id, matchData);
        const { _id, ...matchResult } = updated;
        return { id: _id.toString(), ...matchResult };
      })
    );

    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};
