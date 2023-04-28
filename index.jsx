import React, { createRef } from "react";
import ReactDOM from "react-dom";
import MonacoEditor from "./src";
import "./index.less";

const demoCode1 = `ipackage com.alibaba.security.freud.script.device.portray

import com.alibaba.fastjson.JSON
import com.alibaba.security.freud.export.script.PortrayScript
import com.alibaba.umid.commons.script.test.Debugger

/**
 * PortrayScript
 *
 * @author lyove
 * @since 2023-01-01
 */
class PortrayScript {

    @Override
    void portray(Map<String, Object> systemContext,
                 Map<String, Object> userContext,
                 Map<String, Object> attribute) {

        attribute.put("user_isChild", true)

        println("[PortayScriptDemo2] User Context: " + JSON.toJSONString(userContext))
        println("[PortayScriptDemo2] attribute: " + JSON.toJSONString(attribute))
        Debugger.info("[PortayScriptDemo2] User Context: " + JSON.toJSONString(userContext))
        Debugger.info("[PortayScriptDemo2] attribute: " + JSON.toJSONString(attribute))
    }
}`;

const demoCode2 = `import React, { PureComponent } from 'react';
import MonacoEditor from './MonacoEditor';

export default class App extends PureComponent {
  render() {
    return (
      <MonacoEditor
        language="html"
        value="<h1>I  react-monaco-editor</h1>"
        theme="vs-dark"
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          cursorStyle: 'line',
          automaticLayout: false,
        }}
      />
    );
  }
}`;

/**
 * Editor
 */
export default class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: demoCode2 || "// type your code...",
      language: "javascript",
      files: {
        "a.json": {
          name: "a.json",
          language: "json",
          value: '{ "a": 1 }',
        },
        "b.js": {
          name: "b.js",
          language: "javascript",
          value: "var a = 1",
        },
        "c.sql": {
          name: "c.sql",
          language: "sql",
          value: "SELECT * from table where id = 1",
        },
      },
      fileName: "a.json",
    };
    this.prevHeight = createRef(0);
  }

  editorDidMount(monaco, editor) {
    console.log("editorDidMount", editor, monaco);

    // Autho height
    editor.onDidChangeModelDecorations(() => {
      updateEditorHeight(); // typing
      requestAnimationFrame(updateEditorHeight); // folding
    });

    const updateEditorHeight = () => {
      const editorElement = editor.getDomNode();

      if (!editorElement) {
        return;
      }

      const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
      const lineCount = editor.getModel()?.getLineCount() || 1;
      const height = editor.getTopForLineNumber(lineCount + 1) + lineHeight;

      if (this.prevHeight.current !== height) {
        this.prevHeight.current = height;
        editorElement.style.height = `${height}px`;
        editor.layout();
      }
    };
  }

  onChange(newValue, e) {
    console.log("onChange", newValue, e);
  }

  setValue(val) {
    this.setState({
      code: val,
    });
  }

  setLanguage(val) {
    this.setState({
      language: val,
    });
  }

  render() {
    const { code, language, files, fileName } = this.state;
    const file = files[fileName];
    const options = {
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: false,
      cursorStyle: "line",
      automaticLayout: false,
      fontSize: "14px",
      scrollbar: {
        // Subtle shadows to the left & top. Defaults to true.
        useShadows: false,
        // Render vertical arrows. Defaults to false.
        verticalHasArrows: true,
        // Render horizontal arrows. Defaults to false.
        horizontalHasArrows: true,
        // Render vertical scrollbar.
        // Accepted values: 'auto', 'visible', 'hidden'.
        // Defaults to 'auto'
        vertical: "visible",
        // Render horizontal scrollbar.
        // Accepted values: 'auto', 'visible', 'hidden'.
        // Defaults to 'auto'
        horizontal: "visible",
        verticalScrollbarSize: 17,
        horizontalScrollbarSize: 17,
        arrowSize: 30,
      },
    };

    return (
      <>
        <nav className="header">
          <span className="nav-item">
            <a href="/">Home</a>
          </span>
          <span>
            <a href="https://github.com/kothing/monaco-editor-react/blob/master/README.md">
              Documentation
            </a>
          </span>
          <span className="nav-item">
            <a href="https://github.com/kothing/monaco-editor-react">Github</a>
          </span>
        </nav>
        <div className="editor-demo">
          <div className="feature">
            <h1>MonacoEditor react</h1>
            <div className="desc">
              React component for MonacoEditor without needing to use webpack plugins
            </div>
          </div>

          <div className="section">
            <div className="lable-title">Basic Usage</div>
            <MonacoEditor
              height={"300px"}
              language="javascript"
              editorDidMount={this.editorDidMount.bind(this)}
              onChange={this.onChange.bind(this)}
              value={code}
              options={options}
              theme="vs" // "vs-dark"
              supportFullScreen
              enableOutline
            />
            <br />
            <div>
              Code
              <pre>
                {`<MonacoEditor
  height="300px"
  language="javascript"
  editorDidMount={this.editorDidMount.bind(this)}
  onChange={this.onChange.bind(this)}
  value={code}
  options={options}
  theme="vs" // "vs-dark"
  supportFullScreen
  enableOutline
/>
`}
              </pre>
            </div>
          </div>
          <br />

          <div className="section">
            <div className="lable-title">Diff Usage</div>
            <MonacoEditor.DiffEditor
              original={JSON.stringify({ a: 1 }, null, 2)}
              modified={JSON.stringify({ b: 2 }, null, 2)}
              height={"100px"}
              theme="light"
              language="json"
              enableOutline
            />
          </div>
          <br />

          <div className="section">
            <div className="lable-title">Controlled Value</div>
            <div className="controlled">
              <div className="btn-group mb8">
                <button
                  className="btn mr12"
                  onClick={() => {
                    this.setValue('{ "a": 1 }');
                    this.setLanguage("json");
                  }}
                >
                  Fill json data
                </button>
                <button
                  className="btn mr12"
                  onClick={() => {
                    this.setValue("var a = 1");
                    this.setLanguage("javascript");
                  }}
                >
                  Fill javascript data
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    this.setValue("SELECT * from table where id = 1");
                    this.setLanguage("sql");
                  }}
                >
                  Fill sql data
                </button>
              </div>
              <MonacoEditor
                height={40}
                value={code}
                language={language}
                options={{ readOnly: true }}
                onChange={(next) => {
                  this.setValue(next);
                }}
                enableOutline
              />
            </div>
          </div>
          <br />

          <div className="section">
            <div className="label-title">Multi model</div>
            <div className="btn-group mb8">
              {Object.keys(files).map((key) => (
                <button
                  className="btn mr12"
                  key={key}
                  disabled={key === fileName}
                  onClick={() => {
                    this.setState({
                      fileName: key,
                    });
                  }}
                >
                  {key}
                </button>
              ))}
            </div>
            <MonacoEditor
              height={40}
              path={file.name}
              language={file.language}
              defaultValue={file.value}
              saveViewState
              onChange={(next) => {
                this.setState((v) => ({
                  ...v,
                  [file.name]: {
                    ...v[file.name],
                    value: next,
                  },
                }));
              }}
              enableOutline
            />
          </div>
        </div>
      </>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Editor />
  </React.StrictMode>,
  document.getElementById("app"),
);
