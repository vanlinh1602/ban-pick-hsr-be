import { MatchsService } from 'services/match';
import { TournamentService } from 'services/tournament';

export default (): {} => {
  const tournamentDB = Databases.tournament.db('tournament');

  global.Services = {
    matchs: new MatchsService(tournamentDB),
    tournaments: new TournamentService(tournamentDB),
  };

  return {};
};
