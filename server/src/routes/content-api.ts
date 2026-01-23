export default {
  type: 'content-api',
  routes: [
    {
      method: 'GET',
      path: '/config',
      handler: 'config.get',
      config: {
        auth: false,
      },
    },
  ],
};
