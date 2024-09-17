import { Collection, Db } from 'mongodb';

export const checkRoles = (): boolean => {
  return true;
};

export default class Service<Type> {
  db: Db;

  // @ts-ignore
  collection: Collection<Type>;

  constructor(db: Db, collectionName: string) {
    this.db = db;
    // @ts-ignore
    this.collection = this.db.collection<Type>(collectionName);
  }
}
