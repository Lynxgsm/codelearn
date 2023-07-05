"use client";

import { javascript } from "@codemirror/lang-javascript";
import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";

const CodeDisplay = () => {
  const [value, setvalue] = useState("");

  const onChange = (value: string) => {
    setvalue(value);
  };

  return (
    <CodeMirror
      className="w-full h-full text-lg"
      value={value}
      height="200px"
      extensions={[javascript({ jsx: true })]}
      onChange={onChange}
      theme={"dark"}
    />
  );
};

export default CodeDisplay;
