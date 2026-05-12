import { yup } from '@strapi/utils';

export default {
  default: {
    editor: {},
    tools: {},
  },
  validator(config) {
    try {
      yup
        .object()
        .shape({
          editor: yup.object(),
          tools: yup.object(),
        })
        .validateSync(config);
    } catch (error) {
      throw new Error(`Editor.js plugin configuration error: ${error.errors}`);
    }
  },
};
