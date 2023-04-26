import React, { createRef } from "react";
import ReactDOM from "react-dom";
import MonacoEditor from "./src";
import "./index.less";

const demoCode1 = `ipackage com.alibaba.security.freud.script.device.portray

import com.alibaba.fastjson.JSON
import com.alibaba.security.freud.export.script.PortrayScript
import com.alibaba.umid.commons.script.test.Debugger

/**
 * 刻画脚本Demo
 *
 * @author pinghe.cph
 * @since 2022-11-23
 */
class PortayScriptDemo2 implements PortrayScript {

    @Override
    void portray(Map<String, Object> systemContext,
                 Map<String, Object> userContext,
                 Map<String, Object> attribute) {

        // 保持刻画结果至「个体属性」中
        attribute.put("user_isChild", true)

        // 打印调试日志
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
        options={{
          selectOnLineNumbers: true,
          roundedSelection: false,
          cursorStyle: 'line',
          automaticLayout: false,
          theme: 'vs-dark',
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

      const lineHeight = editor.getOption(
        monaco.editor.EditorOption.lineHeight
      );
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
      theme: "vs-dark",
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
      <div className="editor-test">
        Basic Usage
        <MonacoEditor
          // height={"200px"}
          language="javascript"
          editorDidMount={this.editorDidMount.bind(this)}
          onChange={this.onChange.bind(this)}
          value={code}
          options={options}
          theme="light" // "vs-dark"
          supportFullScreen
        />
        <br />
        <hr />
        <br />
        Diff Usage
        <MonacoEditor.MonacoDiffEditor
          original={JSON.stringify({ a: 1 }, null, 2)}
          value={JSON.stringify({ b: 2 }, null, 2)}
          height={"100px"}
          theme="light"
          language="json"
        />
        <br />
        {/* =====================================================
        <br />
        Controlled Value
        <div className="controlled">
          <button
            onClick={() => {
              this.setValue('{ "a": 1 }');
              this.setLanguage("json");
            }}
          >
            Fill json data
          </button>
          <button
            onClick={() => {
              this.setValue("var a = 1");
              this.setLanguage("javascript");
            }}
          >
            Fill javascript data
          </button>
          <button
            onClick={() => {
              this.setValue("SELECT * from table where id = 1");
              this.setLanguage("sql");
            }}
          >
            Fill sql data
          </button>
          <MonacoEditor
            height={40}
            value={code}
            language={language}
            options={{ readOnly: true }}
            onChange={(next) => {
              this.setValue(next);
            }}
          />
          <MonacoEditor.MonacoDiffEditor
            height={40}
            value={code}
            options={{ readOnly: true }}
            language={language}
          />
        </div>
        <br />
        =====================================================
        <br />
        Multi model
        <div className="multi">
          {Object.keys(files).map((key) => (
            <button
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
          />
        </div> */}
      </div>
    );
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Editor />
  </React.StrictMode>,
  document.getElementById("app")
);
