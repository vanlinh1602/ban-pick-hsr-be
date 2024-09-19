/* eslint-disable class-methods-use-this */
import { Db, ObjectId } from 'mongodb';
import Service from 'services';

type MatchSetUpInfo = {
  banPickStatus: {
    player: string;
    type: 'ban' | 'pick';
    character?: string;
  }[];
  firstPick: number;
  goFirst: number;
};

type Match = {
  _id: string | ObjectId;
  players: [string, string];
  status: 'ban-pick' | 'playing' | 'finished';
  date?: number;
  winner?: string;
  games?: {
    player: string;
    characters: string[];
  }[];
  matchSetup?: MatchSetUpInfo;
};

export class MatchsService extends Service<Match> {
  constructor(db: Db) {
    super(db, 'matchs');
  }

  createMatch = async (match: Match) => {
    const matchId = await this.collection.insertOne(match);
    return matchId.insertedId.toString();
  };

  getMatch = async (id: string) => {
    const match = await this.collection.findOne({ _id: new ObjectId(id) });
    return match;
  };

  updateMatch = async (id: string, match: Partial<Match>) => {
    await this.collection.updateOne({ id }, { $set: match }, { upsert: true });
  };
}
