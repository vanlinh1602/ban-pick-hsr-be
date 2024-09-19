import { Request, Response } from 'express';

export const createMatch = async (req: Request, res: Response) => {
  try {
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
  const { id } = req.body;
  const result = await Services.matchs.getMatch(id);
  if (result) {
    const { _id, ...match } = result;
    res.send({ id: _id.toString(), ...match });
  } else {
    res.status(404).send('Match not found');
  }
};

export const updateMatch = async (req: Request, res: Response) => {
  res.send('updateMatch');
};
