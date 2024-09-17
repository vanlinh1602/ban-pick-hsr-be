import api from './api';
import hoyolab from './hoyolab';

export default () => [
  {
    path: '/api',
    router: api,
  },
  {
    path: '/hoyolab',
    router: hoyolab,
  },
];
