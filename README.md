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

There's currently no support for extending the supported blocks, or adjusting the configuration for the enabled ones.

## Credits
This plugin is mostly duct-taped together based on the existing libraries, that don't yet support Strapi 5:
- https://github.com/melishev/strapi-plugin-react-editorjs
- https://github.com/GregorSondermeier/strapi-plugin-editorjs
