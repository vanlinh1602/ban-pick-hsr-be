import { Request, Response } from 'express';

import characters from '../resources/characters.json';
import combatTypes from '../resources/combatTypes.json';
import paths from '../resources/paths.json';

export const getResource = (req: Request, res: Response) => {
  res.send({
    characters,
    combatTypes,
    paths,
  });
};
