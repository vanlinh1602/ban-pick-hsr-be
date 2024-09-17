import { CreateIndexesOptions, IndexSpecification, MongoClient } from 'mongodb';

type Databases = CustomObject<MongoClient>;

type DatabaseIndex = {
  spec: IndexSpecification;
  options?: CreateIndexesOptions;
};
export type DatabasesConfig = {
  databases: CustomObject<{
    srv: string;
    indexes?: {
      [collection: string]: DatabaseIndex | DatabaseIndex[];
    };
  }>;
};

export default (config: DatabasesConfig): Databases => {
  const databases: Databases = {};
  Object.entries(config.databases).forEach(([dbName, { srv, indexes }]) => {
    databases[dbName] = new MongoClient(srv);
    databases[dbName].connect();

    if (indexes) {
      const db = databases[dbName].db(dbName);
      Object.entries(indexes).forEach(([key, values]) => {
        const collection = db.collection(key);
        const merged = Array.isArray(values) ? values : [values];
        merged.forEach(({ options, spec }) => {
          if (options) collection.createIndex(spec, options);
          else collection.createIndex(spec);
        });
      });
    }
  });

  return databases;
};
