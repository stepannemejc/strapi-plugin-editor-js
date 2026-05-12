# strapi-plugin-editor-js

A plugin to add an editor.js custom field to Strapi 5.

```bash
npm i @matthewkilpatrick/strapi-plugin-editor-js
```

## Addons

The following Editor.js blocks are enabled by default:

- [Paragraph](https://github.com/editor-js/paragraph)
- [Header](https://github.com/editor-js/header)
- [Simple image](https://github.com/editor-js/simple-image) (integrated into the Strapi media library)
- [Embed](https://github.com/editor-js/embed)
- [List](https://github.com/editor-js/list)
- [Raw](https://github.com/editor-js/raw)
- [Quote](https://github.com/editor-js/quote)
- [Table](https://github.com/editor-js/table)

## Configuration

You can override Editor.js options and tool configuration from your Strapi plugin config:

```js
// config/plugins.js
module.exports = {
  'editor-js': {
    config: {
      editor: {
        inlineToolbar: ['dynamicLink'],
      },
      tools: {
        dynamicLink: {
          config: {
            endpoints: {
              categories: '/api/custom-categories',
              itemsByCategory: '/api/custom-items/{categoryId}',
            },
          },
        },
      },
    },
  },
};
```

`editor` is merged into the top-level Editor.js config. `tools` is merged into the default tool definitions.

Tool classes must still exist in the admin bundle. For additional definitions using a bundled tool class, pass the class name as a string:

```js
tools: {
  customDynamicLink: {
    class: 'DynamicLinkTool',
    inlineToolbar: true,
    config: {
      endpoints: {
        categories: '/api/categories',
        itemsByCategory: '/api/items/{categoryId}',
      },
    },
  },
}
```

## Credits

This plugin is mostly duct-taped together based on the existing libraries, that don't yet support Strapi 5:

- https://github.com/melishev/strapi-plugin-react-editorjs
- https://github.com/GregorSondermeier/strapi-plugin-editorjs
