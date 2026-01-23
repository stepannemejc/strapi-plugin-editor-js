import type { Core } from '@strapi/strapi';

const pickString = (value: unknown): string => (typeof value === 'string' ? value : '');

const configController = {
  async get(ctx: any) {
    const { strapi } = ctx as { strapi: Core.Strapi };

    const raw =
      strapi.config.get('plugin.editor-js') ?? strapi.config.get('plugin::editor-js') ?? {};

    const pluginConfig = (
      raw && typeof raw === 'object' && 'config' in raw ? (raw as any).config : raw
    ) as any;

    const styles = pluginConfig?.styles ?? pluginConfig?.style ?? {};

    ctx.body = {
      styles: {
        customCss: pickString(styles?.customCss ?? pluginConfig?.customCss),
        boxClassName: pickString(styles?.boxClassName ?? pluginConfig?.boxClassName),
      },
    };
  },
};

export default configController;
