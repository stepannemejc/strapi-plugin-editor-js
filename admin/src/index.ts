import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { Drag as TextIcon } from '@strapi/icons';
import { Component } from 'react';

export default {
  register(app: any) {
    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
    // @ts-ignore
    app.customFields.register({
      name: 'editor-js',
      pluginId: 'editor-js',
      type: 'json',
      icon: TextIcon,
      intlLabel: {
        id: getTranslation('builder.field.label'),
      },
      intlDescription: {
        id: getTranslation('builder.field.description'),
      },
      options: {
        base: [
          {
            sectionTitle: {
              id: getTranslation('options.sectionTitle'),
            },
            items: [
              {
                name: 'customCss',
                type: 'textarea',
                intlLabel: {
                  id: getTranslation('options.customCss.label'),
                },
                intlDescription: {
                  id: getTranslation('options.customCss.description'),
                },
              },
              {
                name: 'boxClassName',
                type: 'text',
                intlLabel: {
                  id: getTranslation('options.boxClassName.label'),
                },
                intlDescription: {
                  id: getTranslation('options.boxClassName.description'),
                },
              },
            ],
          },
        ],
        advanced: [],
      },
      components: {
        Input: () => import(/* webpackChunkName: "input-component" */ './components/Input.jsx'),
      },
    });
  },

  registerTrads: async function (app: any) {
    const { locales } = app;

    return await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: Object.keys(data).reduce((acc, current) => {
                acc[`editor-js.${current}`] = data[current];
                return acc;
              }, {} as any),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );
  },
};
