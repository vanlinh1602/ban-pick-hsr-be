import { ConfigService } from 'services/configs';
import { MatchesService } from 'services/match';
import { TournamentService } from 'services/tournament';

export default (): {} => {
  const tournamentDB = Databases.tournament.db('tournament');

  global.Services = {
    matches: new MatchesService(tournamentDB),
    tournaments: new TournamentService(tournamentDB),
    configs: new ConfigService(tournamentDB),
  };

  return {};
};
