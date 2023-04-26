# monaco-editor-react
React component for MonacoEditor without needing to use webpack plugins

## Requirements
React v16.x, v17.x, v18.x  
⚠️ React.StrictMode not supported

## API

| prop  | description  | type annotation |
| --- | --- | --- |
| value | value | `string` |
| defaultValue | defaultValue for creating model | `string` |
| language | language of the editor | `string` |
| theme | theme of the editor, `"light" | "vs-dark"` | `string` |
| options | [Monaco editor options](https://microsoft.github.io/monaco-editor/) | `Record<string, any>` |
| path | path of the current model, useful when creating a multi-model editor | `string` |
| className | className of wrapper | `string` |
| width | width of wrapper | `number | string` |
| height | height of wrapper | `number | string` |
| enableOutline | whether to enable outline of wrapper or not | `boolean` |
| style | style of wrapper | `CSSProperties` |
| editorWillMount | callback after monaco's loaded and before editor's loaded | `(monaco: IMonacoInstance) => void` |
| editorDidMount | callback after monaco's loaded and after editor's loaded | `(monaco: IMonacoInstance, editor: IEditorInstance) => void` |

## Usage

### Simple usage with fullscreen toggle

```typescript
<MonacoEditor
  value={val}
  language="json"
  onChange={(next) => {
    setValue(next);
  }}
  height="300px"
  supportFullScreen={true}
/>
```

### Diff Editor

```typescript
<MonacoEditor.MonacoDiffEditor
  original={JSON.stringify({a: 1}, null, 2)}
  value={JSON.stringify({b: 2}, null, 2)}
  height="100px"
  language="json"
/>
```

### Multi Model Saving Scrolling States

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MonacoEditor from 'lyove/MonacoEditor';

function App() {
  const [files, setFiles] = React.useState({
    'a.json': {
      name: 'a.json',
      language: 'json',
      value: '{ "a": 1 }',
    },
    'b.js': {
      name: 'b.js',
      language: 'javascript',
      value: 'var a = 1',
    },
    'c.sql': {
      name: 'c.sql',
      language: 'sql',
      value: 'SELECT * from table where id = 1',
    },
  })
  const [fileName, setFileName] = React.useState("a.json");
  const file = files[fileName];

  return (
    <div>
      {Object.keys(files).map(key => (
        <button
          key={key}
          disabled={key === fileName}
          onClick={() => {
            setFileName(key)
          }}
        >
          {key}
        </button>
      ))}
      <MonacoEditor
        height={"400px"}
        path={file.name}
        language={file.language}
        defaultValue={file.value}
        saveViewState={true}
        onChange={(next) => {
          setFiles(v => ({
            ...v,
            [file.name]: {
              ...v[file.name],
              value: next,
            },
          }))
        }}
      />
    </div>
  );
}

ReactDOM.render(<App />, mountNode);
```
