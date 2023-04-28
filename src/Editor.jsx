import * as React from "react";
import { useRef, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import { useEditor } from "./hooks";
import {
  EDITOR_WRAPPER_CLASS,
  EDITOR_CONTAINER_CLASS,
  EDITOR_INITIALIZING_WORD,
  ICON,
} from "./helper";
import "./style.less";

/**
 * BaseEditor
 * @param {*} props
 * @returns
 */
export const BaseEditor = (props) => {
  const {
    onChange,
    enableOutline,
    width,
    height,
    language,
    theme,
    supportFullScreen,
  } = props;

  const onChangeRef = useRef(onChange);
  const subscriptionRef = useRef(null);
  const originSizeRef = useRef({});
  const fullScreenStatusRef = useRef(false);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const {
    isEditorReady,
    focused,
    loading,
    containerRef,
    monacoRef,
    editorRef,
    valueRef,
  } = useEditor(props);

  const wrapperClassName = classNames(EDITOR_WRAPPER_CLASS, props.className, {
    "ve-focused": focused,
    "ve-outline": enableOutline,
    fullscreen: isFullScreen,
  });

  const containerClassName = classNames(EDITOR_CONTAINER_CLASS, {
    [`theme-${theme}`]: theme,
  });

  const getThemeByDom = () => {
    let _theme = "";
    if (editorRef.current) {
      const editorDomNode = editorRef.current.getDomNode();
      if (editorDomNode.classList.contains("vs")) {
        _theme = "vs";
      } else if (editorDomNode.classList.contains("vs-dark")) {
        _theme = "vs-dark";
      } else if (editorDomNode.classList.contains("hc-light")) {
        _theme = "hc-light";
      } else if (editorDomNode.classList.contains("hc-black")) {
        _theme = "hc-black";
      }
    }
    return _theme;
  };

  const fullScreenClassName = classNames({
    "full-screen-icon": !isFullScreen,
    "full-screen-icon-cancel": isFullScreen,
    [getThemeByDom()]: getThemeByDom()
  });

  const style = useMemo(() => {
    return isFullScreen
      ? {
          width: "100%",
          height: "100vh",
        }
      : {
          width,
          height,
        };
  }, [width, height, isFullScreen]);

  const setEditorHeight = () => {
    if (fullScreenStatusRef.current) {
      const editorInstance = editorRef.current;
      const editorElement = editorInstance?.getDomNode();
      if (editorElement) {
        editorElement.style.height = `${window.innerHeight}px`;
      }
      editorInstance?.layout();
    }
  };

  useEffect(() => {
    window.addEventListener("resize", setEditorHeight);

    return () => {
      subscriptionRef.current?.dispose();
      editorRef.current?.getModel()?.dispose();
      editorRef.current?.dispose();
      window.removeEventListener("resize", setEditorHeight);
    }
  }, []);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (isEditorReady) {
      const editorInstance = editorRef.current;

      if (subscriptionRef.current) {
        subscriptionRef.current.dispose();
      }

      subscriptionRef.current = editorInstance?.onDidChangeModelContent(
        (event) => {
          const editorValue = editorInstance?.getModel().getValue();
          if (valueRef.current !== editorValue) {
            if (onChangeRef.current) {
              onChangeRef.current(editorValue, event);
            }
          }
        }
      );
    }
  }, [isEditorReady]);

  useEffect(() => {
    if (isEditorReady && monacoRef.current) {
      monacoRef.current.editor.setModelLanguage(
        editorRef.current?.getModel(),
        language
      );
    }
  }, [isEditorReady, language]);

  const handleFullScreen = (sizeMode) => {
    const editorInstance = editorRef.current;
    const editorWrapper =
      document.getElementsByClassName(EDITOR_WRAPPER_CLASS)[0];

    if (sizeMode === "max") {
      setIsFullScreen(true);
      fullScreenStatusRef.current = true;
      originSizeRef.current = {
        width: editorWrapper.clientWidth,
        height: editorWrapper.clientHeight,
      };
      editorInstance.updateOptions({
        ...editorInstance?.getOptions(),
      });
      editorInstance.layout({
        height: window.innerHeight || document.documentElement.offsetHeight,
        width: window.innerWidth || document.documentElement.offsetWidth,
      });
      document.body.classList.add("fullScreen-overflow-hidden");
    } else if (sizeMode === "min") {
      setIsFullScreen(false);
      fullScreenStatusRef.current = false;
      editorInstance.updateOptions({
        ...editorInstance?.getOptions(),
      });
      editorInstance.layout({
        height: originSizeRef.current?.height || editorWrapper.clientWidth,
        width: originSizeRef.current?.width || editorWrapper.clientHeight,
      });
      document.body.classList.remove("fullScreen-overflow-hidden");
    }
  };

  return (
    <div className={wrapperClassName} style={props.style}>
      {loading && <span className="loading">{EDITOR_INITIALIZING_WORD}</span>}
      <div ref={containerRef} className={containerClassName} style={style}>
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
  const { enableOutline, width, height, language, theme, modified, original } = props;

  const newProps = {
    ...props,
    value: modified
  };
  
  const {
    isEditorReady,
    focused,
    loading,
    containerRef,
    monacoRef,
    editorRef,
  } = useEditor(newProps, "diff");

  const wrapperClassName = classNames(EDITOR_WRAPPER_CLASS, props.className, {
    "ve-focused": focused,
    "ve-outline": enableOutline,
  });

  const containerClassName = classNames(EDITOR_CONTAINER_CLASS, "editor-diff", {
    [`theme-${theme}`]: theme,
  });

  const style = useMemo(() => ({ width, height }), [width, height]);

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
  }, []);

  useEffect(() => {
    if (!isEditorReady) {
      return;
    }
    editorRef.current.getModel().original.setValue(original ?? "");
  }, [isEditorReady, original]);

  useEffect(() => {
    if (!isEditorReady) {
      return;
    }

    const { original: originalModel, modified: modifiedModel } =
      editorRef.current.getModel();

    if (monacoRef.current) {
      monacoRef.current.editor.setModelLanguage(originalModel, language);
      monacoRef.current.editor.setModelLanguage(modifiedModel, language);
    }
  }, [isEditorReady, language]);

  return (
    <div className={wrapperClassName} style={props.style}>
      {loading && <span className="loading">{EDITOR_INITIALIZING_WORD}</span>}
      <div ref={containerRef} className={containerClassName} style={style} />
    </div>
  );
};
