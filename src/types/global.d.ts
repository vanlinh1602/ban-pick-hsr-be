/* eslint-disable vars-on-top, no-var */
import { MongoClient } from 'mongodb';
import type { HoyoLabService } from 'services/hoyolab';
import type { Logger as LoggerType } from 'winston';

declare global {
  type CustomObject<Type> = {
    [key: string]: Type;
  };
  var ProductID: string;
  var Databases: CustomObject<MongoClient>;
  var Logger: LoggerType;
  var Services: {
    hoyolab: HoyoLabService;
  };
}

declare module 'express-session' {
  interface SessionData {
    user?: any;
  }
}
