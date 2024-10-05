import { Request, Response } from 'express';
import admin from 'firebase-admin';
import { cloneDeep, unset } from 'lodash';
import { validParams } from 'utils/validator';

import characters from '../resources/characters.json';
import filterCharacter from '../resources/filterCharacter.json';
import filterLightCone from '../resources/filterLightCone.json';
import lightCones from '../resources/lightCones.json';

export const auth = async (req: Request, res: Response) => {
  try {
    validParams(req.body, ['token']);
    const { token, user } = req.body;

    const checked = await admin.auth().verifyIdToken(token);
    if (checked.uid !== user.id) {
      throw new Error('Invalid token');
    } else {
      req.session.user = user;
      res.send({ user });
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const signOut = (req: Request, res: Response) => {
  try {
    req.session.destroy(() => {
      res.send({ message: 'Sign out successfully' });
    });
  } catch (error) {
    res.status(500).send(error);
  }
};

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
