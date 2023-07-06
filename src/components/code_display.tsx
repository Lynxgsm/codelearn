"use client";

import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { store } from "../store";

const CodeDisplay = ({ initial }: { initial: string }) => {
  const { setWrittenCode } = store.challenge.actions;

  const onChange = (value: string) => {
    setWrittenCode(value);
  };

  return (
    <CodeMirror
      className="w-full h-full text-lg"
      value={initial}
      height="200px"
      extensions={[javascript({ jsx: true })]}
      onChange={onChange}
      theme={"dark"}
    />
  );
};

export default CodeDisplay;
