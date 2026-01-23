export default [
  {
    method: 'GET',
    path: '/config',
    handler: 'config.get',
    config: {
      policies: [],
    },
  },
];
