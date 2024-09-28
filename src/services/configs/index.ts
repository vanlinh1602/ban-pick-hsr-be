/* eslint-disable class-methods-use-this */
import { Db, Filter } from 'mongodb';
import Service from 'services';

export type Config = {
  _id: string;
  points: number;
};

export class ConfigService extends Service<Config> {
  constructor(db: Db) {
    super(db, 'configs');
  }

  updateConfig = async (id: string, data: Partial<Config>): Promise<number> => {
    const result = await this.collection.updateOne(
      {
        _id: id,
      },
      {
        $set: data,
      },
      { upsert: true }
    );
    return result.modifiedCount || result.upsertedCount;
  };

  queryConfigs = async (query?: Filter<Config>): Promise<Config[]> => {
    if (!query) {
      return this.collection.find().toArray();
    }
    return this.collection.find(query).toArray();
  };

  updateConfigs = async (
    configs: (Config & { id: string })[]
  ): Promise<{ error: string; id: string }[]> => {
    const errors: { error: string; id: string }[] = [];
    await Promise.all(
      configs.map(async (config) => {
        const { id, ...rest } = config;
        const updateResult = await this.updateConfig(id, rest);
        if (!updateResult) {
          errors.push({ error: 'Failed to update', id });
        }
      })
    );
    return errors;
  };
}
