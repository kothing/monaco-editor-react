/* eslint-disable @typescript-eslint/no-empty-function */
import { BaseEditor, DiffEditor } from "./Editor";
import { INITIAL_OPTIONS } from "./helper";

function noop() {}

const MonacoDiffEditor = Object.assign(DiffEditor, {
  displayName: "DiffMonacoEditor",
  defaultProps: {
    width: "100%",
    height: "200px",
    defaultValue: "",
    language: "javascript",
    theme: "vs",
    options: INITIAL_OPTIONS,
    editorDidMount: noop,
    editorWillMount: noop,
    onChange: noop,
  },
});

const MonacoEditor = Object.assign(BaseEditor, {
  displayName: "MonacoEditor",
  defaultProps: {
    width: "100%",
    height: "200px",
    defaultValue: "",
    language: "javascript",
    theme: "vs",
    options: INITIAL_OPTIONS,
    editorDidMount: noop,
    editorWillMount: noop,
    onChange: noop,
  },
  DiffEditor: MonacoDiffEditor,
});

export default MonacoEditor;
