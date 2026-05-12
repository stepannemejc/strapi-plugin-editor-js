import EditorJs from '@editorjs/editorjs';
import EditorJsHeader from '@editorjs/header';
import EditorJsList from '@editorjs/list';
import EditorJsParagraph from '@editorjs/paragraph';
import EditorJsTable from '@editorjs/table';
import EditorJsQuote from '@editorjs/quote';
import EditorJsRaw from '@editorjs/raw';
import EditorJsEmbed from '@editorjs/embed';
import Warning from '@editorjs/warning';
import TOC from '@phigoro/editorjs-toc';
import { Box, Field } from '@strapi/design-system';
import { getFetchClient } from '@strapi/strapi/admin';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { editorJsOutputDataToJson, jsonToEditorJsOutputData } from '../utils/jsonUtils';
import { getTranslation } from '../utils/getTranslation';
import { PLUGIN_ID } from '../pluginId';
import MediaLibComponent from '../medialib/component.jsx';
import MediaLibAdapter from '../medialib/adapter';
import { changeFunc } from '../medialib/utils';
import EditorJsImage from '@editorjs/simple-image';
import { DynamicLinkTool } from 'editorjs-external-item-link-picker';
import 'editorjs-external-item-link-picker/dist/style.css';

const TOOL_CLASSES = {
  paragraph: EditorJsParagraph,
  EditorJsParagraph,
  header: EditorJsHeader,
  EditorJsHeader,
  quote: EditorJsQuote,
  EditorJsQuote,
  table: EditorJsTable,
  EditorJsTable,
  list: EditorJsList,
  EditorJsList,
  mediaLib: MediaLibAdapter,
  MediaLibAdapter,
  image: EditorJsImage,
  EditorJsImage,
  embed: EditorJsEmbed,
  EditorJsEmbed,
  raw: EditorJsRaw,
  EditorJsRaw,
  warning: Warning,
  Warning,
  toc: TOC,
  TOC,
  dynamicLink: DynamicLinkTool,
  DynamicLinkTool,
};

let pluginConfigPromise;

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

const deepMerge = (target, source) => {
  if (!isPlainObject(source)) {
    return target;
  }

  return Object.entries(source).reduce(
    (merged, [key, value]) => {
      if (isPlainObject(value) && isPlainObject(merged[key])) {
        return {
          ...merged,
          [key]: deepMerge(merged[key], value),
        };
      }

      return {
        ...merged,
        [key]: value,
      };
    },
    { ...target }
  );
};

const resolveToolClass = (toolName, toolDefinition, defaultToolDefinition) => {
  if (typeof toolDefinition.class !== 'string') {
    return toolDefinition;
  }

  const toolClass = TOOL_CLASSES[toolDefinition.class] || TOOL_CLASSES[toolName];

  if (toolClass) {
    return {
      ...toolDefinition,
      class: toolClass,
    };
  }

  if (defaultToolDefinition?.class) {
    return {
      ...toolDefinition,
      class: defaultToolDefinition.class,
    };
  }

  console.warn(
    `[${PLUGIN_ID}] Unknown Editor.js tool class "${toolDefinition.class}" for tool "${toolName}".`
  );

  return undefined;
};

const mergeToolsConfig = (defaultTools, configuredTools = {}) =>
  Object.entries(deepMerge(defaultTools, configuredTools)).reduce(
    (tools, [toolName, toolDefinition]) => {
      const resolvedTool = resolveToolClass(toolName, toolDefinition, defaultTools[toolName]);

      if (!resolvedTool) {
        return tools;
      }

      return {
        ...tools,
        [toolName]: resolvedTool,
      };
    },
    {}
  );

const getPluginConfig = async () => {
  if (!pluginConfigPromise) {
    pluginConfigPromise = getFetchClient()
      .get(`/${PLUGIN_ID}/config`)
      .then(({ data }) => data?.data || {})
      .catch((error) => {
        console.warn(
          `[${PLUGIN_ID}] Could not load plugin config. Using default Editor.js config.`,
          error
        );
        return {};
      });
  }

  return pluginConfigPromise;
};

/**
 * @template {({ target: { name: string, value: string } }) => any} OnChangeFn
 *
 * @param { Object } params
 * @param { string } params.contentTypeUID
 * @param { string } params.error
 * @param { string } params.intlLabel
 * @param { string } params.intlDescription
 * @param { string } params.labelAction
 * @param { string } params.name
 * @param { OnChangeFn } params.onChange - function to set the OutputData in the content manager
 * @param { boolean } params.required
 * @param { string } params.value - the editorjs OutputData
 * @returns { JSX.Element }
 * @constructor
 */
const Input = (params) => {
  let { name, onChange, value } = params;
  const { formatMessage } = useIntl();

  const [elementId] = useState(`editorjs-${name}`);
  const [editorJsOutputData, setEditorJsOutputData] = useState(jsonToEditorJsOutputData(value));
  const [editorJsInstance, setEditorJsInstance] = useState(undefined);
  const [pluginConfig, setPluginConfig] = useState({});
  const [isPluginConfigLoaded, setIsPluginConfigLoaded] = useState(false);

  const [isMediaLibOpen, setIsMediaLibOpen] = useState(false);

  const mediaLibToggleFunc = () => setIsMediaLibOpen((prev) => !prev);

  const handleMediaLibChange = (data) => {
    changeFunc({
      data,
      editor: editorJsInstance,
    });
    mediaLibToggleFunc();
  };

  useEffect(() => {
    setEditorJsOutputData(jsonToEditorJsOutputData(value));
  }, [value]);

  useEffect(() => {
    getPluginConfig().then((config) => {
      setPluginConfig(config);
      setIsPluginConfigLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!editorJsInstance && isPluginConfigLoaded) {
      const tools = {
        paragraph: {
          // https://github.com/editor-js/paragraph
          class: EditorJsParagraph,
          inlineToolbar: true,
          config: {
            placeholder: formatMessage({ id: getTranslation('placeholder.paragraph') }),
          },
        },
        header: {
          // https://github.com/editor-js/header
          class: EditorJsHeader,
          inlineToolbar: true,
          config: {
            placeholder: formatMessage({ id: getTranslation('placeholder.header') }),
            defaultLevel: 1,
          },
        },
        quote: {
          // https://github.com/editor-js/quote
          class: EditorJsQuote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: formatMessage({ id: getTranslation('placeholder.quote') }),
            captionPlaceholder: formatMessage({
              id: getTranslation('placeholder.quoteCaption'),
            }),
          },
        },
        table: {
          // https://github.com/editor-js/table
          class: EditorJsTable,
          inlineToolbar: true,
          config: {
            withHeadings: true,
          },
        },
        list: {
          // https://github.com/editor-js/list
          class: EditorJsList,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        mediaLib: {
          class: MediaLibAdapter,
          config: {
            mediaLibToggleFunc,
          },
        },
        image: {
          class: EditorJsImage,
          inlineToolbar: true,
          toolbox: false, // only loaded to support rendering medialib images
        },
        embed: {
          class: EditorJsEmbed,
          inlineToolbar: true,
          config: {
            services: {
              bunnystream: {
                regex: /https:\/\/iframe.mediadelivery.net\/(embed|play)\/([0-9]+)\/([0-9a-f\-]+)/,
                embedUrl:
                  'https://iframe.mediadelivery.net/embed/<%= remote_id %>?autoplay=false&loop=false&muted=false&preload=true&responsive=true',
                html: "<iframe scrolling='no' frameborder='no' allow='accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;' allowfullscreen='true' style='width: 100%; aspect-ratio: 16/9'></iframe>",
                id: (groups) => groups.slice(1).join('/'),
              },
            },
          },
        },
        raw: {
          class: EditorJsRaw,
          inlineToolbar: true,
        },
        // toc: {
        //   class: TOC,
        // },
        warning: {
          class: Warning,
          inlineToolbar: true,
        },
        dynamicLink: {
          class: DynamicLinkTool,
          inlineToolbar: true,
          config: {
            endpoints: {
              categories: '/api/categories',
              itemsByCategory: '/api/items/{categoryId}',
            },
          },
        },
      };

      const configuredEditorOptions = pluginConfig.editor || {};
      const configuredTools = pluginConfig.tools || {};
      const editorConfig = {
        ...deepMerge(
          {
            minHeight: 32,
            inlineToolbar: ['dynamicLink'],
          },
          configuredEditorOptions
        ),
        tools: mergeToolsConfig(tools, configuredTools),
      };

      setEditorJsInstance(
        // https://editorjs.io/configuration
        new EditorJs({
          ...editorConfig,
          holder: elementId,
          data: editorJsOutputData,
          onChange: async (api) => {
            const outputData = await api.saver.save();
            setEditorJsOutputData(outputData);
            onChange({ target: { name, value: editorJsOutputDataToJson(outputData) } });
          },
        })
      );
    }
  }, [
    editorJsInstance,
    editorJsOutputData,
    elementId,
    formatMessage,
    isPluginConfigLoaded,
    name,
    onChange,
    pluginConfig,
  ]);

  return (
    <>
      <Field.Label for={elementId}>{name}</Field.Label>
      <Box
        id={elementId}
        className="editorjs-box"
        borderColor="neutral200"
        hasRadius={true}
        paddingLeft="64px"
        paddingRight="16px"
        paddingTop="16px"
        paddingBottom="16px"
        style={{
          backgroundColor: 'white',
          color: 'black',
        }}
      />
      <style>{`
          .codex-editor h1 {
            font-size: 3rem;
            font-weight: bold;
          }
          .codex-editor h2 {
            font-size: 2.5rem;
            font-weight: bold;
          }
          .codex-editor h3 {
            font-size: 2rem;
            font-weight: bold;
          }
          .codex-editor h4 {
            font-size: 1.9rem;
            font-weight: bold;
          }
          .codex-editor h5 {
            font-size: 1.7rem;
            font-weight: bold;
          }
          .codex-editor h6 {
            font-size: 1.6rem;
            font-weight: bold;
          }
          .codex-editor {
            font-size: 1.5rem;
          }
        `}</style>
      <MediaLibComponent
        isOpen={isMediaLibOpen}
        onChange={handleMediaLibChange}
        onToggle={mediaLibToggleFunc}
      />
    </>
  );
};

Input.propTypes = {
  contentTypeUID: PropTypes.string,
  error: PropTypes.string,
  intlLabel: PropTypes.string,
  intlDescription: PropTypes.string,
  labelAction: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  required: PropTypes.bool,
  value: PropTypes.string,
};

export default Input;
