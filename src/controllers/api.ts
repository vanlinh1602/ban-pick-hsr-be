import { Request, Response } from 'express';
import { cloneDeep, unset } from 'lodash';
import { validParams } from 'utils/validator';

import characters from '../resources/characters.json';
import filterCharacter from '../resources/filterCharacter.json';
import filterLightCone from '../resources/filterLightCone.json';
import lightCones from '../resources/lightCones.json';

export const getResource = (req: Request, res: Response) => {
  const data = {
    characters,
    lightCones,
    filterCharacter,
    filterLightCone,
  };
  res.send({
    data,
    configs: Resources.configs,
  });
};

export const updateConfigs = async (req: Request, res: Response) => {
  try {
    validParams(req.body, ['configs']);
    const { configs } = req.body;
    const results = await Services.configs.updateConfigs(
      Object.entries(configs).map(([key, value]: [string, any]) => ({ id: key, ...value }))
    );
    const dataUpdated = cloneDeep(configs);
    results.forEach((result) => {
      unset(dataUpdated, result.id);
    });
    Resources.configs = { ...Resources.configs, ...dataUpdated };
    res.send(results);
  } catch (error) {
    res.status(500).send(error);
  }
};
