const pickString = (value: unknown): string => (typeof value === 'string' ? value : '');

const configController = {
  async get(ctx) {
    const { strapi } = ctx;

    const raw =
      strapi.config.get('plugin.editor-js') ??
      // Some Strapi versions use the plugin:: prefix in config keys
      strapi.config.get('plugin::editor-js') ??
      {};

    const pluginConfig = raw && typeof raw === 'object' && 'config' in raw ? raw.config : raw;
    const styles = pluginConfig?.styles ?? pluginConfig?.style ?? {};

    const customCss = pickString(styles?.customCss ?? pluginConfig?.customCss);

    ctx.body = {
      customCss,
      styles: {
        customCss,
      },
    };
  },
};

export default configController;
