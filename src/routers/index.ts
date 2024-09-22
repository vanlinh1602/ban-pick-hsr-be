import api from './api';
import match from './match';
import tournament from './tournament';

export default () => [
  {
    path: '/api',
    router: api,
  },
  {
    path: '/match',
    router: match,
  },
  {
    path: '/tournament',
    router: tournament,
  },
];
