import { useEffect, useRef, useState } from "react";

import { DIFF_EDITOR_INITIAL_OPTIONS, INITIAL_OPTIONS } from "./helper";
import loader from "./loader";

function getOrCreateModel(monaco, value, language, path) {
  if (path) {
    const prevModel = monaco.editor.getModel(monaco.Uri.parse(path));
    if (prevModel) {
      return prevModel;
    }
  }

  return monaco.editor.createModel(
    value,
    language,
    path && monaco.Uri.parse(path)
  );
}

/**
 * usePrevious
 * @param {*} value
 * @returns
 */
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

/**
 * useEditor
 * @param {*} type single | diff
 * @param {*} props
 * @returns
 */
export const useEditor = (props, type) => {
  const {
    editorDidMount,
    editorWillMount,
    theme,
    value,
    original,
    path,
    language,
    saveViewState,
    defaultValue,
    enhancers,
    overrideServices,
  } = props;

  const [isEditorReady, setIsEditorReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  const defaultValueRef = useRef(defaultValue);
  const valueRef = useRef(value);
  const originalRef = useRef(original);
  const languageRef = useRef(language || "text");
  const pathRef = useRef(path);
  const optionRef = useRef(props.options);
  const monacoRef = useRef();
  const editorRef = useRef();
  const containerRef = useRef();
  const typeRef = useRef(type);
  const editorDidMountRef = useRef();
  const editorWillMountRef = useRef();
  const decomposeRef = useRef(false);
  const viewStatusRef = useRef(new Map());
  const enhancersRef = useRef({});

  const previousPath = usePrevious(path);

  useEffect(() => {
    setLoading(true);
    loader()
      .then((monaco) => {
        window.MonacoEnvironment = undefined;
        if (typeof window.define === "function" && window.define.amd) {
          // make monaco-editor's loader work with webpack's umd loader
          // @see https://github.com/microsoft/monaco-editor/issues/2283
          delete window.define.amd;
        }

        // make sure loader editor only init once
        if (monacoRef.current) {
          return;
        }

        monacoRef.current = monaco;

        try {
          if (editorWillMountRef.current) {
            editorWillMountRef.current(monaco);
          }
        } catch (err) {
          //
        }

        if (!containerRef.current) {
          return;
        }

        let editor;
        if (typeRef.current === "diff") {
          const originalModel = monaco.editor.createModel(
            originalRef.current,
            languageRef.current
          );
          const modifiedModel = monaco.editor.createModel(
            valueRef.current,
            languageRef.current
          );
          editor = monaco.editor.createDiffEditor(
            containerRef.current,
            {
              automaticLayout: true,
              ...DIFF_EDITOR_INITIAL_OPTIONS,
              ...optionRef.current,
            },
            overrideServices
          );
          editor.setModel({ original: originalModel, modified: modifiedModel });
        } else {
          const model = getOrCreateModel(
            monaco,
            valueRef.current ?? defaultValueRef.current ?? "",
            languageRef.current,
            pathRef.current
          );
          editor = monaco.editor.create(
            containerRef.current,
            {
              automaticLayout: true,
              ...INITIAL_OPTIONS,
              ...optionRef.current,
            },
            overrideServices
          );
          editor.setModel(model);
        }
      
        editorRef.current = editor;
        (enhancersRef.current.enhancers || []).forEach((en) =>
          en(monaco, editor)
        );
        try {
          if (editorDidMountRef.current) {
            editorDidMountRef.current(monaco, editor);
          }
        } catch (err) {
          //
        }
        !decomposeRef.current && setIsEditorReady(true);
      })
      .catch((err) => {
        console.error("Monaco Editor Load Error!", err);
      })
      .then(() => {
        !decomposeRef.current && setLoading(false);
      });

    // decomposing status
    return () => {
      decomposeRef.current = true;
    };
  }, []);

  useEffect(() => {
    enhancersRef.current.enhancers = enhancers;
  }, [enhancers]);

  useEffect(() => {
    editorDidMountRef.current = editorDidMount;
  }, [editorDidMount]);

  useEffect(() => {
    editorWillMountRef.current = editorWillMount;
  }, [editorWillMount]);

  useEffect(() => {
    valueRef.current = value;
    originalRef.current = original;
  }, [value, original]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    defaultValueRef.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    if (!isEditorReady) {
      return;
    }

    monacoRef.current.editor.setTheme(theme);
  }, [isEditorReady, theme]);

  // focus status
  useEffect(() => {
    if (!isEditorReady) {
      return;
    }

    const editor =
      type === "diff"
        ? editorRef.current.getModifiedEditor()
        : editorRef.current;

    if (editor) {
      editor.onDidFocusEditorText(() => {
        !decomposeRef.current && setFocused(true);
      });
      editor.onDidBlurEditorText(() => {
        !decomposeRef.current && setFocused(false);
      });
    }
  }, [isEditorReady, type]);

  // controlled value -- diff mode / without path only
  useEffect(() => {
    if (!isEditorReady) {
      return;
    }

    if (type !== "diff" && !!path) {
      return;
    }

    const editor =
      type === "diff"
        ? editorRef.current.getModifiedEditor()
        : editorRef.current;
    const nextValue = value ?? defaultValueRef.current ?? "";

    if (editor) {
      if (editor.getOption?.(monacoRef.current?.editor.EditorOption.readOnly)) {
        editor.setValue(nextValue);
      } else if (value !== editor?.getValue()) {
        editor.executeEdits("", [
          {
            range: editor?.getModel().getFullModelRange(),
            text: nextValue,
            forceMoveMarkers: true,
          },
        ]);
        editor.pushUndoStop();
      }
    }
  }, [isEditorReady, path, type, value]);

  // multi-model && controlled value (shouldn't be diff mode)
  useEffect(() => {
    if (!isEditorReady) {
      return;
    }

    if (type === "diff") {
      return;
    }

    if (path === previousPath) {
      return;
    }

    const model = getOrCreateModel(
      monacoRef.current,
      valueRef.current ?? defaultValueRef.current,
      languageRef.current,
      path
    );

    const editor = editorRef.current;
    if (
      valueRef.current !== null &&
      valueRef.current !== undefined &&
      model.getValue() !== valueRef.current
    ) {
      model.setValue(valueRef.current);
    }
    if (model !== editorRef.current.getModel()) {
      saveViewState &&
        viewStatusRef.current.set(previousPath, editor.saveViewState());
      editor.setModel(model);
      saveViewState && editor.restoreViewState(viewStatusRef.current.get(path));
    }
  }, [isEditorReady, value, path, previousPath, type]);

  return {
    isEditorReady,
    focused,
    loading,
    containerRef,
    monacoRef,
    editorRef,
    valueRef,
  };
};
