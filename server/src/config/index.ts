import { yup } from '@strapi/utils';

export default {
  default: {
    tools: {},
    customCss: '',
  },
  validator(config) {
    try {
      yup
        .object()
        .shape({
          tools: yup.object(),
          customCss: yup.string(),
          styles: yup
            .object()
            .shape({
              customCss: yup.string(),
            })
            .optional(),
        })
        .validateSync(config);
    } catch (error) {
      throw new Error(`Editor.js plugin configuration error: ${error.errors}`);
    }
  },
};
