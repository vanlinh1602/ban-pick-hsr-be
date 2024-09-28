/* eslint-disable vars-on-top, no-var */
import { MongoClient } from 'mongodb';
import type { ConfigService } from 'services/configs';
import type { MatchesService } from 'services/match';
import type { TournamentService } from 'services/tournament';
import type { Logger as LoggerType } from 'winston';

declare global {
  type CustomObject<Type> = {
    [key: string]: Type;
  };
  var ProductID: string;
  var Databases: CustomObject<MongoClient>;
  var Logger: LoggerType;
  var Services: {
    matches: MatchesService;
    tournaments: TournamentService;
    configs: ConfigService;
  };
  var Resources: {
    configs: CustomObject<any>;
  };
}

declare module 'express-session' {
  interface SessionData {
    user?: any;
  }
}
