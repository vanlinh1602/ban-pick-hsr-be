import { Request, Response } from 'express';

import characters from '../resources/characters.json';
import filterCharacter from '../resources/filterCharacter.json';
import filterLightCone from '../resources/filterLightCone.json';
import lightCones from '../resources/lightCones.json';

export const getResource = (req: Request, res: Response) => {
  res.send({
    characters,
    lightCones,
    filterCharacter,
    filterLightCone,
  });
};
