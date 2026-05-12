import type { Core } from '@strapi/strapi';

const configController = ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = {
      data: {
        editor: strapi.plugin('editor-js').config('editor', {}),
        tools: strapi.plugin('editor-js').config('tools', {}),
      },
    };
  },
});

export default configController;
