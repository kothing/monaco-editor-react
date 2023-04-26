/* eslint-disable prettier/prettier */
export const EDITOR_CDN_PATH_PARTIAL = "https://cdn.jsdelivr.net/npm/monaco-editor@0.36.1";

export const EDITOR_ALI_CDN_PATH_PARTIAL = "https://g.alicdn.com/code/lib/monaco-editor/0.36.1";

export const INITIAL_OPTIONS = {
  fontSize: 13,
  tabSize: 2,
  fontFamily: "Menlo, Monaco, Courier New, monospace",
  folding: true,
  minimap: {
    enabled: true,
  },
  autoIndent: "advanced",
  contextmenu: true,
  useTabStops: true,
  wordBasedSuggestions: true,
  formatOnPaste: true,
  automaticLayout: true,
  lineNumbers: "on",
  wordWrap: "off",
  scrollBeyondLastLine: false,
  fixedOverflowWidgets: true,
  snippetSuggestions: "top",
  scrollbar: {
    vertical: "auto",
    horizontal: "auto",
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },
};

export const DIFF_EDITOR_INITIAL_OPTIONS = {
  fontSize: 13,
  fontFamily: "Menlo, Monaco, Courier New, monospace",
  folding: true,
  minimap: {
    enabled: false,
  },
  autoIndent: "advanced",
  contextmenu: true,
  useTabStops: true,
  formatOnPaste: true,
  automaticLayout: true,
  lineNumbers: "on",
  wordWrap: "off",
  scrollBeyondLastLine: false,
  fixedOverflowWidgets: true,
  snippetSuggestions: "top",
  scrollbar: {
    vertical: "auto",
    horizontal: "auto",
    verticalScrollbarSize: 10,
    horizontalScrollbarSize: 10,
  },
};

export const EDITOR_WRAPPER_CLASS = "monaco-editor-react-wrapper";

export const EDITOR_CONTAINER_CLASS = "editor-container";

export const CURRENT_LANGUAGE = (navigator.language || navigator.browserLanguage).toLowerCase().indexOf('zh') > -1 ? "zh-CN" : "en";

export const EDITOR_INITIALIZING_WORD = CURRENT_LANGUAGE === "en" ? "Initializing Editor" : "编辑器初始化中";

export const ICON = {
  max: (
    <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
      <path d="M342 88H120c-17.7 0-32 14.3-32 32v224c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16V168h174c8.8 0 16-7.2 16-16v-48c0-8.8-7.2-16-16-16zm578 576h-48c-8.8 0-16 7.2-16 16v176H682c-8.8 0-16 7.2-16 16v48c0 8.8 7.2 16 16 16h222c17.7 0 32-14.3 32-32V680c0-8.8-7.2-16-16-16zM342 856H168V680c0-8.8-7.2-16-16-16h-48c-8.8 0-16 7.2-16 16v224c0 17.7 14.3 32 32 32h222c8.8 0 16-7.2 16-16v-48c0-8.8-7.2-16-16-16zM904 88H682c-8.8 0-16 7.2-16 16v48c0 8.8 7.2 16 16 16h174v176c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16V120c0-17.7-14.3-32-32-32z" />
    </svg>
  ),
  min: (
    <svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
      <path d="M326 664H104c-8.8 0-16 7.2-16 16v48c0 8.8 7.2 16 16 16h174v176c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16V696c0-17.7-14.3-32-32-32zm16-576h-48c-8.8 0-16 7.2-16 16v176H104c-8.8 0-16 7.2-16 16v48c0 8.8 7.2 16 16 16h222c17.7 0 32-14.3 32-32V104c0-8.8-7.2-16-16-16zm578 576H698c-17.7 0-32 14.3-32 32v224c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16V744h174c8.8 0 16-7.2 16-16v-48c0-8.8-7.2-16-16-16zm0-384H746V104c0-8.8-7.2-16-16-16h-48c-8.8 0-16 7.2-16 16v224c0 17.7 14.3 32 32 32h222c8.8 0 16-7.2 16-16v-48c0-8.8-7.2-16-16-16z" />
    </svg>
  ),
};
