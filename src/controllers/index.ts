import { HoyoLabService } from 'services/hoyolab';

export default (): {} => {
  const simulatorDB = Databases.simulator.db('simulator');

  global.Services = {
    hoyolab: new HoyoLabService(simulatorDB),
  };

  return {};
};
