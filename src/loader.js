import { EDITOR_CDN_PATH_PARTIAL, EDITOR_ALI_CDN_PATH_PARTIAL } from "./helper";

// the local state of the module
const state = {
  config: {
    paths: {
      vs: `${EDITOR_CDN_PATH_PARTIAL}/min/vs`,
    },
  },
  isInitialized: false,
  resolve: null,
  reject: null,
  monaco: null,
};

// functions compose
const compose = (...fns) => {
  return (x) => fns.reduceRight((y, f) => f(y), x);
};

// injects provided scripts into the document.body
const injectScripts = (script) => {
  return document.body.appendChild(script);
};

// creates an HTML script element with/without provided src
const createScript = (src) => {
  const script = document.createElement("script");
  script.src = src;
  return script;
};

// configures the monaco loader
const configureLoader = () => {
  const { require } = window;
  require.config(state.config);
  require(["vs/editor/editor.main"], (monaco) => {
    storeMonacoInstance(monaco);
    state.resolve(monaco);
  }, (error) => {
    state.reject(error);
  });
};

// creates an HTML script element with the monaco loader src
const getMonacoLoaderScript = (configLoader) => {
  const loaderScript = createScript(`${state.config.paths.vs}/loader.js`);
  loaderScript.onload = () => configLoader();
  loaderScript.onerror = state.reject;
  return loaderScript;
};

// store monaco instance in local state
const storeMonacoInstance = (monaco) => {
  if (!state.monaco) {
    state.monaco = monaco;
  }
};

// Wrapper promise
const wrapperPromise = new Promise((resolve, reject) => {
  state.resolve = resolve;
  state.reject = reject;
});

/**
 * Handles the initialization of the monaco-editor
 * setup monaco-editor into your browser by using its `loader` script
 * @returns returns an instance of monaco
 */
const loader = () => {
  state.config = {
    paths: {
      vs: `${EDITOR_ALI_CDN_PATH_PARTIAL}/min/vs`,
    },
  };

  if (!state.isInitialized) {
    state.isInitialized = true;

    if (state.monaco) {
      state.resolve(state.monaco);
      return wrapperPromise;
    }

    if (window.monaco && window.monaco.editor) {
      storeMonacoInstance(window.monaco);
      state.resolve(window.monaco);
      return wrapperPromise;
    }

    compose(injectScripts, getMonacoLoaderScript)(configureLoader);
  }

  return wrapperPromise;
};

export default loader;
