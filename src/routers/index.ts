import api from './api';
import match from './match';

export default () => [
  {
    path: '/api',
    router: api,
  },
  {
    path: '/match',
    router: match,
  },
];
