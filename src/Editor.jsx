import * as React from "react";
import { useRef, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { useEditor } from "./hooks";
import { EDITOR_WRAPPER_CLASS, EDITOR_INITIALIZING_WORD, ICON } from "./helper";
import "./style.css";

/**
 * BaseEditor
 * @param {*} props
 * @returns
 */
export const BaseEditor = (props) => {
  const { onChange, enableOutline, width, height, language, theme, supportFullScreen } = props;

  const onChangeRef = useRef(onChange);
  const subscriptionRef = useRef(null);
  const originScreenSizeRef = useRef({});
  const fullscreenStatusRef = useRef(false);

  const [isFullScreen, setIsFullScreen] = useState(fullscreenStatusRef.current || false);

  const {
    isEditorReady,
    focused,
    loading,
    containerRef,
    monacoRef,
    editorRef,
    valueRef,
  } = useEditor("single", props);

  const wrapperClassName = classNames(EDITOR_WRAPPER_CLASS, props.className, {
    "ve-focused": focused,
    "ve-outline": enableOutline,
    fullscreen: isFullScreen,
  });

  const editorClassName = classNames("editor-container", {
    [`theme-${theme}`]: theme,
  });

  const fullScreenClassName = classNames({
    "full-screen-icon": !isFullScreen,
    "full-screen-icon-cancel": isFullScreen,
  });

  const style = useMemo(() => {
    return {
      width,
      height,
    };
  }, [width, height]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (isEditorReady) {
      const editorInstance = editorRef.current;
      if (subscriptionRef.current) {
        subscriptionRef.current.dispose();
      }
      subscriptionRef.current = editorInstance?.onDidChangeModelContent((event) => {
        const editorValue = editorInstance?.getModel().getValue();
        if (valueRef.current !== editorValue) {
          if (onChangeRef.current) {
            onChangeRef.current(editorValue, event);
          }
        }
      });
    }
  }, [editorRef, isEditorReady, subscriptionRef, valueRef]);

  useEffect(() => {
    const editorInstance = editorRef.current;
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.dispose();
      }
      if (editorInstance) {
        editorInstance.getModel().dispose();
        editorInstance.dispose();
      }
    };
  }, [editorRef]);

  useEffect(() => {
    if (!isEditorReady) {
      return;
    }
    if (monacoRef.current) {
      monacoRef.current.editor.setModelLanguage(editorRef.current?.getModel(), language);
    }
  }, [editorRef, isEditorReady, language, monacoRef]);

  const handleFullScreen = (sizeMode) => {
    const editorWrapper = document.getElementsByClassName(EDITOR_WRAPPER_CLASS)[0];
    const editorInstance = editorRef.current;

    setIsFullScreen(sizeMode === "max");
    fullscreenStatusRef.current = sizeMode === "max";

    if (sizeMode === "max") {
      originScreenSizeRef.current = {
        width: editorWrapper.clientWidth,
        height: editorWrapper.clientHeight,
      };
      editorInstance.layout({
        height: document.body.clientHeight,
        width: document.body.clientWidth,
      });
      editorWrapper.classList.add("fullscreen");
    } else if (sizeMode === "min") {
      editorInstance.layout({
        height: originScreenSizeRef.current?.height || editorWrapper.clientWidth,
        width: originScreenSizeRef.current?.width || editorWrapper.clientHeight,
      });
      editorWrapper.classList.remove("fullscreen");
    }

    editorInstance.updateOptions({
      ...editorInstance?.getOptions(),
    });
  };

  return (
    <div className={wrapperClassName} style={props.style}>
      {loading && <span className="loading">{EDITOR_INITIALIZING_WORD}</span>}
      <div ref={containerRef} className={editorClassName} style={style}>
        {supportFullScreen && (
          <div
            className={fullScreenClassName}
            onClick={() => handleFullScreen(isFullScreen ? "min" : "max")}
          >
            {isFullScreen ? ICON.min : ICON.max}
          </div>
        )}
      </div>
    </div>
  );
};


/**
 * DiffEditor
 * @param {*} props
 * @returns
 */
export const DiffEditor = (props) => {
  const { enableOutline, width, height, language, theme, original } = props;

  const { isEditorReady, focused, loading, containerRef, monacoRef, editorRef } = useEditor("diff", props);

  const wrapperClassName = classNames(EDITOR_WRAPPER_CLASS, props.className, {
    "ve-focused": focused,
    "ve-outline": enableOutline,
  });

  const editorClassName = classNames("editor-container", "editor-diff", {
    [`theme-${theme}`]: theme,
  });

  const style = useMemo(() => ({ width, height }), [width, height]);

  useEffect(() => {
    if (!isEditorReady) {
      return;
    }
    editorRef.current.getModel().original.setValue(original ?? "");
  }, [editorRef, isEditorReady, original]);

  useEffect(() => {
    const editorInstance = editorRef.current;
    return () => {
      if (editorInstance) {
        const md = editorInstance.getModel();
        if (md) {
          md.original.dispose();
          md.modified.dispose();
        }
        editorInstance.dispose();
      }
    };
  }, [editorRef]);

  useEffect(() => {
    if (!isEditorReady) {
      return;
    }

    const { original: originalModel, modified: modifiedModel } = editorRef.current?.getModel();

    if (monacoRef.current) {
      monacoRef.current.editor.setModelLanguage(originalModel, language);
      monacoRef.current.editor.setModelLanguage(modifiedModel, language);
    }
  }, [editorRef, isEditorReady, language, monacoRef]);

  return (
    <div className={wrapperClassName} style={props.style}>
      {loading && <span className="loading">{EDITOR_INITIALIZING_WORD}</span>}
      <div ref={containerRef} className={editorClassName} style={style} />
    </div>
  );
};
