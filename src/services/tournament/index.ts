/* eslint-disable class-methods-use-this */
import { Db, ObjectId, WithId } from 'mongodb';
import Service from 'services';

type Player = {
  id: string;
  name: string;
  email: string;
};

export type Tournament = {
  _id: string;
  name: string;
  date: {
    from: number;
    to?: number;
  };
  organizer: {
    id: string;
    name: string;
  };
  description: string;
  players: Player[];
  format: 'single' | 'double';
  status: 'set-up' | 'start' | 'finished';
  rounds?: CustomObject<string[]>[];
};

export class TournamentService extends Service<Tournament> {
  constructor(db: Db) {
    super(db, 'tournaments');
  }

  createTournament = async (tournament: Tournament): Promise<Tournament> => {
    const id = new ObjectId().toString();
    const matchId = await this.collection.updateOne(
      { _id: id },
      { $set: tournament },
      { upsert: true }
    );
    if (matchId.modifiedCount || matchId.upsertedCount) {
      return { ...tournament, _id: id };
    }
    throw new Error('Failed to create match');
  };

  getTournaments = async (id?: string): Promise<Tournament[]> => {
    if (id) {
      const tournament = await this.collection.findOne({ _id: id });
      return tournament ? [tournament] : [];
    }
    const tournaments = await this.collection.find().toArray();
    return tournaments;
  };

  updateTournament = async (
    id: string,
    tournament: Partial<Tournament>
  ): Promise<WithId<Tournament>> => {
    const result = await this.collection.findOneAndUpdate(
      { _id: id },
      { $set: tournament },
      { upsert: true, returnDocument: 'after' }
    );
    if (result) {
      return result;
    }
    throw new Error('Failed to update match');
  };
}
