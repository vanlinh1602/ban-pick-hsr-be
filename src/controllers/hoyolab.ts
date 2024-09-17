import { Request, Response } from 'express';

export const getGameRecords = async (req: Request, res: Response) => {
  const { cookie } = req.body;
  const gameRecords = await Services.hoyolab.getGameRecords(cookie);
  res.json(gameRecords);
};
