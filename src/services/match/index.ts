/* eslint-disable class-methods-use-this */
import { Db, Filter, ObjectId } from 'mongodb';
import Service from 'services';

type Player = {
  id: string;
  name: string;
  email: string;
};

type MatchSetUpInfo = {
  banPickStatus: {
    player: number;
    type: 'ban' | 'pick';
    character?: string;
  }[];
  firstPick: number;
  goFirst: number;
};

type MatchGame = {
  player: number;
  characters: string[];
  lightCones: string[];
  points: number;
};

export type Match = {
  _id: ObjectId;
  players: Player[];
  status: 'set-up' | 'ban-pick' | 'playing' | 'finished';
  date?: number;
  tournamentId?: string;
  winner?: number;
  winMatch?: string;
  lossMatch?: string;
  games?: MatchGame[];
  host?: {
    id: string;
    email?: string;
  };
  matchSetup?: MatchSetUpInfo;
  isLive?: boolean;
};

export class MatchesService extends Service<Match> {
  constructor(db: Db) {
    super(db, 'matchs');
  }

  createMatch = async (match: Match) => {
    const matchId = await this.collection.insertOne(match);
    if (matchId.insertedId) {
      return matchId.insertedId.toString();
    }
    throw new Error('Failed to create match');
  };

  getMatch = async (id: string) => {
    const idObj = new ObjectId(id);
    const match = await this.collection.findOne({ _id: idObj });
    return match;
  };

  queryMatches = async (filter: Filter<Match>): Promise<Match[]> => {
    const matches = await this.collection.find({ ...filter }).toArray();
    return matches;
  };

  updateMatch = async (id: string, match: Partial<Match>) => {
    const idObj = new ObjectId(id);
    const result = await this.collection.findOneAndUpdate(
      { _id: idObj },
      { $set: match },
      { upsert: true, returnDocument: 'after' }
    );
    if (result) {
      return result;
    }
    throw new Error('Failed to update match');
  };
}
