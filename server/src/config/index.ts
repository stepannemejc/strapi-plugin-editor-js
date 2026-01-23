import { yup } from '@strapi/utils';

export default {
  default: {
    tools: {},
    styles: {
      customCss: '',
      boxClassName: '',
    },
  },
  validator(config) {
    try {
      yup
        .object()
        .shape({
          tools: yup.object(),
          styles: yup.object().shape({
            customCss: yup.string(),
            boxClassName: yup.string(),
          }),
        })
        .validateSync(config);
    } catch (error) {
      throw new Error(`Editor.js plugin configuration error: ${error.errors}`);
    }
  },
};
