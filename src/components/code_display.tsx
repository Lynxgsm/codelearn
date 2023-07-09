import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";
import { store } from "../store";

const CodeDisplay = ({ initial }: { initial: string }) => {
  const onChange = (value: string) => {
    store.challenge.writtenCode = value;
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
