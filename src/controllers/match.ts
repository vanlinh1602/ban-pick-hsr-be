import { Request, Response } from 'express';
import { validParams } from 'utils/validator';

export const createMatch = async (req: Request, res: Response) => {
  try {
    validParams(req.body, ['mathInfo']);
    const { mathInfo } = req.body;
    const match = {
      ...mathInfo,
      status: 'ban-pick',
    };
    const result = await Services.matchs.createMatch(match);
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
    const result = await Services.matchs.getMatch(id);
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
    const result = await Services.matchs.queryMatches(filter);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send('Matches not found');
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

export const updateMatch = async (req: Request, res: Response) => {
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
