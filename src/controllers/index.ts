import { MatchsService } from 'services/match';

export default (): {} => {
  const tournamentDB = Databases.tournament.db('tournament');

  global.Services = {
    matchs: new MatchsService(tournamentDB),
  };

  return {};
};
