import type { Core } from '@strapi/strapi';

const configController = ({ strapi }: { strapi: Core.Strapi }) => ({
  getConfig(ctx) {
    const pluginConfig = strapi.config.get('plugin.editor-js', {}) as {
      customCss?: unknown;
    };

    ctx.body = {
      customCss: typeof pluginConfig.customCss === 'string' ? pluginConfig.customCss : '',
    };
  },
});

export default configController;
