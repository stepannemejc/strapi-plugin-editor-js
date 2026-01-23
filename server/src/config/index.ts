import {yup} from '@strapi/utils';

export default {
  default: {
    tools: {}
  },
  validator(config) {
    try {
      yup
        .object()
        .shape({
          tools: yup.object()
        })
        .validateSync(config);
    } catch (error) {
      throw new Error(
        `Editor.js plugin configuration error: ${error.errors}`
      );
    }
  },
};
