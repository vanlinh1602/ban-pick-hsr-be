/* eslint-disable class-methods-use-this */
import { Db, Filter, ObjectId } from 'mongodb';
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
  _id: string;
  players: { name: string; id: string }[];
  status: 'ban-pick' | 'playing' | 'finished';
  date?: number;
  winner?: string;
  games?: {
    player: number;
    characters: string[];
    points: number;
  }[];
  matchSetup?: MatchSetUpInfo;
};

export class MatchsService extends Service<Match> {
  constructor(db: Db) {
    super(db, 'matchs');
  }

  createMatch = async (match: Match) => {
    const id = new ObjectId().toString();
    const matchId = await this.collection.updateOne({ _id: id }, { $set: match }, { upsert: true });
    if (matchId.modifiedCount || matchId.upsertedCount) {
      return id;
    }
    throw new Error('Failed to create match');
  };

  getMatch = async (id: string) => {
    const match = await this.collection.findOne({ _id: id });
    return match;
  };

  queryMatches = async (filter: Filter<Match>): Promise<Match[]> => {
    const matches = await this.collection.find({ ...filter }).toArray();
    return matches;
  };

  updateMatch = async (id: string, match: Partial<Match>) => {
    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      { $set: match },
      { upsert: true, returnDocument: 'after' }
    );
    if (result) {
      return result;
    }
    throw new Error('Failed to update match');
  };
}
