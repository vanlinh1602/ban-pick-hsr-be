/* eslint-disable class-methods-use-this */
import { Hoyolab, ICookie } from 'michos_api';
import { Db } from 'mongodb';
import Service from 'services';

type HoyoLab = {
  email: string;
  cookie: string;
};

export class HoyoLabService extends Service<HoyoLab> {
  constructor(db: Db) {
    super(db, 'cookies');
  }

  getGameRecords = async (cookie: ICookie) => {
    const hoyolab = new Hoyolab({ cookie });
    const gameRecords = await hoyolab.gameRecordCard();
    return gameRecords;
  };
}
